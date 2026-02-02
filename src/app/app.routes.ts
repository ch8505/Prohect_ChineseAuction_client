import { Routes } from '@angular/router';
import { LoginComponent } from './components/auth/login/login';
import { RegisterComponent } from './components/auth/register/register';
import { GiftGallery } from './components/purchaser/gift-gallery/gift-gallery';
import { Home } from './pages/home/home';
import { GiftCatalog } from './components/gift-catalog/gift-catalog';
import { ManagementDonor } from './components/manager/management-donor/management-donor';

export const routes: Routes = [
    { path: '', component: Home }, 
    { path: 'catalog', component: GiftCatalog },
    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegisterComponent },
    
    // הגדרת נתיבי ניהול (Manager)
    { 
        path: 'manager', 
        children: [
            { path: '', component: GiftGallery }, // ברירת מחדל לניהול מתנות
            { path: 'gifts', component: GiftGallery }, // ניהול מתנות
            { path: 'donors', component: ManagementDonor },   // ניהול תורמים
            { path: 'raffle', component: Home },   // זמני: הפניה להום עד שייבנה
            { path: 'reports', component: Home }   // זמני: הפניה להום עד שייבנה
        ]
    },

    // נתיב לטיפול במקרים של כתובת לא ידועה - החזרה לדף הבית
    { path: '**', redirectTo: '' }
];