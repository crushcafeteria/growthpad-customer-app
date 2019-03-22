import {BrowserModule} from '@angular/platform-browser';
import {ErrorHandler, NgModule} from '@angular/core';
import {IonicApp, IonicErrorHandler, IonicModule} from 'ionic-angular';

import {MyApp} from './app.component';
import {HomePage} from '../pages/home/home';

import {StatusBar} from '@ionic-native/status-bar';
import {SplashScreen} from '@ionic-native/splash-screen';
import {AdProvider} from '../providers/ad/ad';
import {LandingPageModule} from "../pages/landing/landing.module";
import {HttpClientModule} from "@angular/common/http";
import {SearchOptionsComponent} from "../components/search-options/search-options";
import {KeywordPageModule} from "../pages/search/keyword/keyword.module";
import {NetworkProvider} from "../providers/network/network";
import {AlertProvider} from "../providers/alert/alert";
import {ToastProvider} from "../providers/toast/toast";
import {IonicStorageModule} from "@ionic/storage";
import {AccountProvider} from '../providers/account/account';
import {LoaderProvider} from "../providers/loader/loader";
import {ReactiveFormsModule} from "@angular/forms";
import {HttpModule} from "@angular/http";
import {SignupPageModule} from "../pages/signup/signup.module";
import {InAppBrowser} from "@ionic-native/in-app-browser";
import {SupportProvider} from '../providers/support/support';
import {LocationPageModule} from "../pages/location/location.module";
import {ViewAdPageModule} from "../pages/view-ad/view-ad.module";
import {ProfilePageModule} from "../pages/profile/profile.module";
import {OrdersPageModule} from "../pages/orders/orders.module";
import {AddToCartPageModule} from "../pages/add-to-cart/add-to-cart.module";
import {OrderProvider} from '../providers/order/order';
import {FilePath} from "@ionic-native/file-path";
import {Camera} from "@ionic-native/camera";
import {File} from "@ionic-native/file";
import {EditProfilePageModule} from "../pages/edit-profile/edit-profile.module";
import {ViewOrderPageModule} from "../pages/view-order/view-order.module";
import {UploadProfilePicturePageModule} from "../pages/upload-profile-picture/upload-profile-picture.module";
import {PostAdPageModule} from "../pages/post-ad/post-ad.module";
import {UpdateOrderPageModule} from "../pages/update-order/update-order.module";
import {ListAdsPageModule} from "../pages/list-ads/list-ads.module";
import {ListSpPageModule} from "../pages/list-sp/list-sp.module";
import {ListSpAdsPageModule} from "../pages/list-sp-ads/list-sp-ads.module";
import {MyAdsPageModule} from "../pages/my-ads/my-ads.module";
import {CodePush} from "@ionic-native/code-push";
import {CateringOptionsPageModule} from "../pages/catering-options/catering-options.module";
import {FeedbackPageModule} from "../pages/feedback/feedback.module";
import {VerifyPaymentPageModule} from "../pages/verify-payment/verify-payment.module";
import {SocialSharing} from "@ionic-native/social-sharing";

@NgModule({
    declarations: [
        MyApp,
        HomePage,
        SearchOptionsComponent
    ],
    imports: [
        BrowserModule,
        IonicModule.forRoot(MyApp),
        HttpClientModule,
        LandingPageModule,
        KeywordPageModule,
        IonicStorageModule.forRoot({
            name: 'growthpadDB',
            driverOrder: ['sqlite', 'indexeddb', 'websql']
        }),
        ReactiveFormsModule,
        HttpModule,
        SignupPageModule,
        LocationPageModule,
        ViewAdPageModule,
        ProfilePageModule,
        OrdersPageModule,
        AddToCartPageModule,
        EditProfilePageModule,
        ViewOrderPageModule,
        UploadProfilePicturePageModule,
        PostAdPageModule,
        UpdateOrderPageModule,
        ListAdsPageModule,
        ListSpPageModule,
        ListSpAdsPageModule,
        MyAdsPageModule,
        CateringOptionsPageModule,
        FeedbackPageModule,
        VerifyPaymentPageModule
    ],
    bootstrap: [IonicApp],
    entryComponents: [
        MyApp,
        HomePage,
        SearchOptionsComponent,
    ],
    providers: [
        StatusBar,
        SplashScreen,
        {provide: ErrorHandler, useClass: IonicErrorHandler},
        AdProvider,
        NetworkProvider,
        AlertProvider,
        ToastProvider,
        AccountProvider,
        LoaderProvider,
        InAppBrowser,
        SupportProvider,
        OrderProvider,
        FilePath,
        Camera,
        File,
        CodePush,
        SocialSharing
    ]
})
export class AppModule {
}
