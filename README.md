# template-reactwindvitejs

template sederhana untuk multipage web vite jsx + tailwind + react router dom + firebase

req space kurang lebih 100mb


### cara install


```
git clone https://github.com/irfanhku/template-reactwindvitejs

cd template-reactwindvitejs

cd template-reactwindvitejs  // lagi

npm install
```

untuk build ke dist or run local

```
npm run build

npm run dev
atau
npm run dev -- --host
```

done

---

### cara setup new page


1. buat file baru di /src/pages, contoh: Newpages.tsx
2. buat link route baru, edit file /src/App.jsx

```
...
import Newpages from "./pages/Newpages"

...
<Route path="/Routebaru" element={<Newpages />} />

```

main.jsx ga usah diganti karena langsung link ke App.jsx

3. done, jadi kalau mau edit page tinggal ke /src/pages/.. edit file .jsx yang mau diedit.


---

### cara setup firebase firestore connection

1. edit isi file config dari file /src/firebase.js

2. isi config bisa dapet dari web console.firebase.google.com, project anda, dan ke setting, general, dibawah settingan Your Apps, pilih web app kalau ada pilihan.

3. copy paste seluruh config ke firebase.js tadi

docs about firestore: https://firebase.google.com/docs/firestore/manage-databases?hl=en 

4. done, biasanya firestore perlu juga file firestore.rules di root folder (setting aja sendiri)

---

### cara deploy multipage ke firebase

0. login to firebase

```
firebase login

firebase login:ci

firebase login --reauth
```

1. edit file .firebaserc

```
{
  "projects": {
    "default": "your-project-id" 
  }
}
```

change the "your-project-id", to your project name

setelah itu, coba check dengan type in cmd

```
firebase use


atau (for more info, kalau berhasil itu juga)

firebase projects:list
```

Dan harusnya project sudah sama dengan di file .firebaserc


2. karena sudah ada semua file needed to deploy (kayaknya), jadi tinggal `firebase deploy`, tapi of course perlu install firebase cli dan set to what project to deploy to.

i add

```
...
"hosting": {
    "public": "dist",
    "ignore": [
      "firebase.json",
      "**/.*",
      "**/node_modules/**"
    ],
    "rewrites": [
      {
        "source": "**",
        "destination": "/index.html"
      }
    ]
  }
```
that code to `firebabse.json` , jadi intinya semua file di ./dist yang akan jadi di deploy dan multipage nya akan works dikarenakan ada rewrites.

2. sehingga sebelum deploy perlu di build dulu dengan

```
npm run build
```

dan maka folder /dist akan ada beserta isinya.

3. done, tinggal deploy.


---

docs terkait utk belajar

https://tailwindcss.com/docs/styling-with-utility-classes

https://firebase.google.com/docs/hosting?hl=en

https://firebase.google.com/docs/auth?hl=en

https://vite.dev/guide/

https://reactrouter.com/start/framework/installation


untuk next

https://nextjs.org/docs


