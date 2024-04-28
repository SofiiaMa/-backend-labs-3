# Лабораторна робота №4-5. Аутентивікація NestJs та Laravel за допомогою Keycloak

## Мета: Налагодження аутентифікації за допомогою Keycloak

## Теоретичні відомості

**Keycloak** — це рішення з відкритим вихідним кодом для управління ідентифікацією та доступом, призначене для сучасних програм і сервісів. Це полегшує захист додатків і служб за допомогою мінімального коду або без нього. Keycloak використовує стандарти відкритого протоколу, такі як Open ID Connect або SAML 2.0, особливо в сценаріях Identity Federation і SSO.

Автентифікація за допомогою Keycloak пропонує практично всі функції, які можуть знадобитися щодо автентифікації та авторизації користувачів. Деякі з них включають

- Єдиний вхід і вихід
- Підтримка OpenID Connect і SAML 2.0
- Вхід через соціальні мережі
- Керування обліковими записами користувачів через веб-консоль та REST API

## Як працює Keycloak?

Додатки налаштовуються таким чином, щоб вони вказували на сервер Keycloak і були захищені ним. 
Веб-додатки перенаправляють браузер користувача з додатку на сервер автентифікації Keycloak, 
де вони вводять свої облікові дані. Це важливо, оскільки користувачі повністю ізольовані
від додатків, і додатки ніколи не бачать облікових даних користувача. 
Замість цього додаткам надається токен ідентифікації або ствердження,
яке криптографічно підписане. Ці токени можуть містити інформацію про ідентифікацію, 
таку як ім'я користувача, адреса, електронна пошта та інші профільні дані. 
Вони також можуть містити дані про дозволи, щоб додатки могли приймати рішення про авторизацію. 
Ці токени також можуть використовуватися для здійснення безпечних викликів на REST-сервісах.

## Конфігурація Keycloak

### Налаштуйте сервер Keycloak
Є кілька способів налаштувати екземпляр Keycloak. Дотримуйтесь інструкцій за [посиланням](https://www.keycloak.org/getting-started/getting-started-docker).    Після завершення налаштування вам слід увійти на сервер Keycloak, використовуючи    надані облікові дані облікового запису адміністратора.

   ![image](https://miro.medium.com/v2/resize:fit:828/format:webp/1*HuA_bOyHpjDhLJuUbxeEcA.png)

### Створіть область (Realm)

   Область захищає та керує метаданими безпеки для набору користувачів, програм і зареєстрованих клієнтів OAuth. 
   Користувачі можуть бути створені, обмежені певною областю на консолі адміністрування. 
   Ролі можна визначити на рівні області. Ви також можете налаштувати зіставлення ролей користувачів, 
   щоб призначити ці дозволи окремим користувачам. Створіть сферу, натиснувши кнопку «Додати область» у спадному списку «Вибрати область» . Дайте назву відповідно до своїх уподобань і натисніть кнопку «Створити» .

   ![image](https://miro.medium.com/v2/resize:fit:828/format:webp/1*gR-rJQljJh41o2K498oQzA.png)

   Після цього ви будете перенаправлені на сторінку налаштувань області.

   ![image](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*_4KFPw1tsoZIYVZoAK-OOw.png)

   Переконайтеся, що для наведених нижче конфігурацій вибрано Demo-Realm . Уникайте використання головної області. 
   Вам не потрібно щоразу створювати область. Це одноразовий процес.

### Створення клієнтів

   Клієнти – це об’єкти, які можуть використовуватм Keycloak для автентифікації користувача. 
   Найчастіше клієнтами є програми та служби, які хочуть використовувати Keycloak, 
   щоб захистити себе та забезпечити єдиний вхід. Клієнти також можуть бути об’єктами, 
   які просто хочуть запитати ідентифікаційну інформацію або маркер доступу, 
   щоб вони могли безпечно викликати інші служби в мережі, захищеної через Keycloak.

   ![image](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*Vk5MU1C0dERgtLcseW1PSA.png)

   Тут ми повинні зареєструвати додаток NestJs як клієнт Keycloak на сервері Keycoak.

   Клієнт: nest-app

   ![image](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*mWX70z49d5i08v9siLilxw.png)

   Для створеного клієнта встановіть Тип доступу лише Bearer

   ![image](https://miro.medium.com/v2/resize:fit:828/format:webp/1*wHUy51eqTledq-5bhmQ4WA.png)


#### Пояснення типів доступу:

- **Bearer-only** — це для сервісів, які покладаються виключно на токен, включений у запит, і ніколи не ініціюють вхід самостійно. 
Зазвичай він використовується для захисту серверної частини.

- **Confidential** — клієнтам цього типу потрібно надати **client secret**, щоб ініціювати логін процес. 
Здебільшого використовується в потоці **OAuth client credential**.

  - **Public** — оскільки ми не маємо реального способу приховати секрет у браузерній програмі на основі JS, саме цього нам і потрібно дотримуватися.

### Створення ролей

Ролі визначають тип або категорію користувача. Адміністратор, користувач, менеджер і 
співробітник — типові ролі, які можуть існувати в організації. 
Програми часто призначають доступ і дозволи певним ролям, а не окремим користувачам, 
оскільки робота з користувачами може бути надто тонкою і важкою для керування. 
Наприклад, консоль адміністратора має певні ролі, які надають користувачам доступ до частин інтерфейсу 
консолі адміністратора та виконання певних дій. Існує глобальний простір імен для ролей, і кожен клієнт також має власний виділений простір імен, де можна визначити ролі.

*Ролі області*: ролі на рівні області — це глобальний простір імен для визначення ваших ролей.
1. Створення клієнтськийх ролей (адміністратор і користувач) для клієнта програми nest

![image](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*W2DPZQlPQN8_04pnZEo29A.png)

2. Створення ролей області (app-admin та app-user) для клієнта nest-app

![image](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*0mXB30al5fcNv9fxjruU3w.png)

Composite Roles: будь-яку роль на рівні сфери або клієнта можна перетворити на складену роль.
Composite Roles — це роль, яка пов’язана з однією або кількома додатковими ролями. 
Коли складову роль прив’язують до користувача, користувач також отримує ролі, пов’язані з цією складовою. 
Це успадкування є рекурсивним, тому будь-яка композиція композитів також успадковується.

3. Після збереження ролей області ввімкніть Composite Roles і знайдіть клієнтську реакційну веб-програму в полі Client Roles . Виберіть роль адміністратора та натисніть Додати вибране . У цій конфігурації роль клієнта адміністратора nest-app буде призначена для ролі адміністратора програми . Якщо у вас є кілька клієнтів із кількома ролями, виберіть необхідні ролі для кожного клієнта, щоб створити ролі сфери відповідно до потреб.

![image](https://miro.medium.com/v2/resize:fit:828/format:webp/1*txK_7wRRkUYfWn-Q1x73FA.png)

4. Аналогічно додається роль клієнта користувача до ролі області користувача програми.

![image](https://miro.medium.com/v2/resize:fit:828/format:webp/1*jJOH_1dl78X17vCYqlVNVw.png)

### Створення користувачів

**Користувачі** – це особи, які можуть входити у вашу систему. 
Вони можуть мати пов’язані з собою атрибути, як-от електронна адреса, 
ім’я користувача, адреса та номер телефону. Їх можна розподіляти по групах і призначати їм певні ролі.

Створіть трьох користувачів і призначте їм наступні ролі області:
- **User1** з користувачем **app-user**
- **User2** з **app-admin**
- **User3** з **app-user** та **app-admin**

Перейдіть на вкладку «Облікові дані», щоб встановити облікові дані користувача.

![image](https://miro.medium.com/v2/resize:fit:828/format:webp/1*6NQCEsB3thJN7gKwQqUbew.png)

На вкладці «Зіставлення ролей» призначте потрібні ролі користувачам.

![image](https://miro.medium.com/v2/resize:fit:828/format:webp/1*Z7efnXLB_a9muQrxH_PWUA.png)

Як і вище, призначте роль app-user для User2 і pp-user, app-admin для User3

### Конфігурація додатку NestJs

Для зв’язку з сервером KeycloakМи використовуємо адаптер nest-keycloak-connect.

Keycloak Client Adapers — це бібліотеки, які спрощують захист програм і служб за допомогою Keycloak.

Додамо бібліотеку nest Keycloak до нашої кодової бази

```bash
npm install nest-keycloak-connect --save
```

Тепер нам потрібно додати конфігурацію Keycloak до NestJs. 
Тут ми додаємо конфігурацію до app.module.ts. 
Але якщо ви хочете, ви можете створити окремий модуль для конфігурації Keycloak та імпортувати цей модуль у app.module.ts.

'app.module.ts'

```typescript
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import {
  KeycloakConnectModule,
  ResourceGuard,
  RoleGuard,
  AuthGuard,
} from 'nest-keycloak-connect';
import { APP_GUARD } from '@nestjs/core';
@Module({
  imports: [
    KeycloakConnectModule.register({
      authServerUrl: 'http://localhost:8080/auth',
      realm: 'Demo-Realm',
      clientId: 'nest-app',
      secret: '83790b4f-48cd-4b6c-ac60-451a918be4b9',
      // Secret key of the client taken from keycloak server
    }),
  ],
  controllers: [AppController],
  providers: [
    AppService,
    // This adds a global level authentication guard,
    // you can also have it scoped
    // if you like.
    //
    // Will return a 401 unauthorized when it is unable to
    // verify the JWT token or Bearer header is missing.
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    // This adds a global level resource guard, which is permissive.
    // Only controllers annotated with @Resource and 
    // methods with @Scopes
    // are handled by this guard.
    {
      provide: APP_GUARD,
      useClass: ResourceGuard,
    },
    // New in 1.1.0
    // This adds a global level role guard, which is permissive.
    // Used by `@Roles` decorator with the 
    // optional `@AllowAnyRole` decorator for allowing any
    // specified role passed.
    {
      provide: APP_GUARD,
      useClass: RoleGuard,
    },
  ],
})
export class AppModule {}
```


Тут ми використовуємо AuthGuard, ResourceGuard, RoleGuard від nest-keycloak-connect для захисту наших кінцевих точок.
Тепер ми додаємо наступні кінцеві точки до нашого контролера та запускаємо програму за допомогою npm start.

'app.controller.ts'

```typescript
@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}
@Get()
  getpublic(): string {
    return `${this.userService.getHello()} from public`;
  }
@Get('/user')
  getUser(): string {
    return `${this.userService.getHello()} from user`;
  }
@Get('/admin')
  getAdmin(): string {
    return `${this.userService.getHello()} from admin`;
  }
@Get('/all')
  getAll(): string {
    return `${this.userService.getHello()} from all`;
  }
}
```

Спробувавши отримати доступ до цих кінцевих точок - отримуєте {“statusCode”:401,”message”:”Unauthorized”} із цих кінцевих точок.
Щоб надати доступ до цих кінцевих точок, ми можемо використовувати такі анотації.

'app.controller.ts'

```typescript
@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}
@Get('/public')
  @Unprotected()
  getpublic(): string {
    return `${this.userService.getHello()} from public`;
  }
@Get('/user')
  @Roles('user')
  getUser(): string {
    return `${this.userService.getHello()} from user`;
  }
@Get('/admin')
  @Roles('admin')
  getAdmin(): string {
    return `${this.userService.getHello()} from admin`;
  }
@Get('/all')
  @AllowAnyRole()
  getAll(): string {
    return `${this.userService.getHello()} from all`;
  }
}
```


Тепер ми можемо отримати доступ до кінцевої точки /user з JWT, приєднаним у заголовку авторизації.

Але якщо ми спробуємо отримати доступ до кінцевої точки /admin, ми отримаємо 403, оскільки User1 не має ролі адміністратора.

Ми можемо отримати доступ до кінцевої точки /all , оскільки це дозволено для будь-яких ролей.

[Оригінал статті](https://medium.com/devops-dudes/secure-nestjs-rest-api-with-keycloak-745ef32a2370)


## Завдана

1. Запустити сервіс Keycloak
2. Створіти  область з ім'ям <your_firstname>
3. Створити клієнтів, групи та  користувачів у області <your_firstname>
4. Налагодити конфігурацію Keycloak у додатку NestJs
5. Додати авторизацію до кінцевих точок додатку з попереньої роботи
6. Запустити додаток та перевірити доступ до кінцевих точок
7. Виконати аналогічні дії для додатку Laravel 
8. Завантажити проект до власного репозиторію з назвою за шаблоном <vendor>/backend-labs-3 на GitHub/Bitbucket та надати посилання на нього у якості звіту.


## Контрольні питання

- Що таке Keycloak і які основні функції він надає?
- Які стандарти відкритого протоколу використовуються Keycloak для забезпечення автентифікації та авторизації?
- Як працює автентифікація з використанням Keycloak? Опишіть процес.
- Які переваги має використання токенів ідентифікації та стверджень в контексті застосування Keycloak?
- Які основні кроки потрібно виконати для налаштування сервера Keycloak?
- Що таке Realm в Keycloak і яка його роль?
- Які типи ролей можна визначити в Keycloak і яка їхня призначеність?
- Як створити клієнта в Keycloak і яку роль він відіграє у системі?
- Що таке Composite Roles в Keycloak і як вони працюють?
- Як створити користувача в Keycloak і як призначити йому ролі?
- Які дії потрібно виконати для конфігурації додатку NestJs для використання з Keycloak?

## Дадаткові посилання

- https://medium.com/js-dojo/authentication-made-easy-in-vue-js-with-keycloak-c03c7fff67bb
- https://www.keycloak.org/getting-started/getting-started-docker
- https://wkrzywiec.medium.com/create-and-configure-keycloak-oauth-2-0-authorization-server-f75e2f6f6046
  https://github.com/robsontenorio/laravel-keycloak-guard
- https://medium.com/inspiredbrilliance/implementing-authentication-in-next-js-v13-application-with-keycloak-part-1-f4817c53c7ef
- https://medium.com/devops-dudes/secure-nestjs-rest-api-with-keycloak-745ef32a2370
- https://stackoverflow.com/questions/72968095/nestjs-with-swagger-ui-oauth-keycloak-cors-problem
- [Authentication made easy in Vue.js with Keycloak](https://medium.com/js-dojo/authentication-made-easy-in-vue-js-with-keycloak-c03c7fff67bb)
- [Getting started with Keycloak REST API](https://medium.com/@fairushyn/getting-started-with-keycloak-rest-api-c760ca398e3)
- [Доступ к конечным точкам Keycloak с помощью Postman](https://for-each.dev/lessons/b/-postman-keycloak-endpoints)
- [Keycloak Admin REST API](https://www.keycloak.org/docs-api/22.0.1/rest-api/index.html)
- [Secure NestJs Rest API with Keycloak](https://medium.com/devops-dudes/secure-nestjs-rest-api-with-keycloak-745ef32a2370)
- https://saurav-samantray.medium.com/dockerize-keycloak-21-with-a-custom-theme-b6f2acad03d5  / https://github.com/saurav-samantray/custom-auth-service
- https://github.com/baloise/vue-keycloak
