# nabungah-webapp

webapp untuk nabung dan monitoring keuangan lainnya

TODO

~~0. add limiation uang minus~~
1. nanti add export to clipboard info statistik
~~2. add fungsi tuker uang cash -> dana atau yg lain (ga keitung income)~~
~~3. tambah goal info dan firestore connect modal~~
~~4. tambah crud button (UTAMANYA DELETE DAN ADD) untuk recent transact and utk quick action and utk wallet~~
5. animasi modal and aos?
6. input click "enter" for submit/save
7. ...

```
start of firestore structure

users (collection)
└── {uid} (document) → example: "uid_abc123"
    ├── name: string = "Ivan"
    ├── email: string = "ivan@gmail.com"
    ├── createdAt: timestamp = 2026-05-23T10:00:00Z

    ├── wallets (collection)
    │   └── {walletId} (document) → example: "wallet_cash"
    │       ├── name: string = "Cash"
    │       ├── balance: int64 = 1500000
    │       ├── createdAt: timestamp = 2026-05-01T10:00:00Z
    │       └── updatedAt: timestamp = 2026-05-23T12:00:00Z
    │
    │   └── {walletId} → example: "wallet_dana"
    │       ├── name: string = "Dana"
    │       ├── balance: int64 = 2000000
    │       ├── createdAt: timestamp = 2026-05-01T10:00:00Z
    │       └── updatedAt: timestamp = 2026-05-23T12:00:00Z

    ├── transactions (collection)
    │   └── {transactionId} → example: "trx_001"
    │       ├── title: string = "Gaji Bulanan"
    │       ├── amount: int64 = 7000000
    │       ├── type: string = "income"
    │       ├── walletId: string = "wallet_dana"
    │       ├── note: string = ""
    │       ├── date: timestamp = 2026-05-23T08:00:00Z
    │       ├── month: string = "2026-05"
    │       ├── year: int64 = 2026
    │       └── createdAt: timestamp = 2026-05-23T08:00:00Z
    │
    │   └── {transactionId} → example: "trx_002"
    │       ├── title: string = "Belanja"
    │       ├── amount: int64 = 85000
    │       ├── type: string = "expense"
    │       ├── walletId: string = "wallet_cash"
    │       ├── note: string = "ini isi optional"
    │       ├── date: timestamp = 2026-05-23T12:00:00Z
    │       ├── month: string = "2026-05"
    │       ├── year: int64 = 2026
    │       └── createdAt: timestamp = 2026-05-23T12:00:00Z

    ├── quickactions (collection)
    │   └── {actionId} → example: "salary"
    │       ├── title: string = "Gaji Bulanan"
    │       ├── type: string = "income"
    │       ├── amount: int64 = 7000000
    │       ├── createdAt: timestamp = 2026-05-01T00:00:00Z
    │       └── updatedAt: timestamp = 2026-05-01T00:00:00Z
    │
    │   └── {actionId} → example: "bensin"
    │       ├── title: string = "Isi Bensin (Rp. 20.000rb)"
    │       ├── type: string = "expense"
    │       ├── amount: int64 = 20000
    │       └── createdAt: timestamp = 2026-05-01T00:00:00Z
    │       └── updatedAt: timestamp = 2026-05-01T00:00:00Z

    ├── goals (collection)
    │   └── {goalId} → example: "goal_macbook"
    │       ├── title: string = "MacBook M3"
    │       ├── targetAmount: int64 = 25000000
    │       ├── savedAmount: int64 = 5000000
    │       ├── status: string = "in_progress"
    │       └── createdAt: timestamp = 2026-05-01T00:00:00Z

    └── datas (collection)
        └── {monthId} → example: "2026-05"
            ├── month: string = "2026-05"
            ├── totalBalance: int64 = 5500000
            ├── totalIncome: int64 = 7000000
            ├── totalExpense: int64 = 1500000
            ├── feeExpense: int64 = 37500
            ├── feePercent: double = 2.5
            └── updatedAt: timestamp = 2026-05-23T12:00:00Z


end of firestore

```


```
git clone

cd nabungah-webapp

npm install

-

npm run build

npm run dev

---


# template-reactwindvitejs

template sederhana untuk multipage web vite jsx + tailwind + react router dom + firebase

req space kurang lebih 100mb


### cara install


```
git clone https://github.com/irfanhku/template-reactwindvitejs

cd template-reactwindvitejs

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


