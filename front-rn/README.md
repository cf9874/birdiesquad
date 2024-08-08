### compire error from react-native-fetch-blob

edit-position: kvx-bs-front\front-rn\node_modules\react-native-fetch-blob\android\build.gradle

dependencies {
compire 'com.facebook.react:react-native:+'
//{RNFetchBlob_PRE_0.28_DEPDENDENCY}
}

=>

dependencies {
implementation 'com.facebook.react:react-native:+'
//{RNFetchBlob_PRE_0.28_DEPDENDENCY}
}

### 폴더구조

-   `src`
    -   `apis`
        -   connertor (axios connect class)
        -   context (api class)
        -   dto
            -   response (응답 객체)
            -   request (요청객체)
        -   services (api class를 사용하는 객체)
    -   `assets`
        -   images (이미지폴더 , index에서 이미지 전달)
    -   `common` ( 전역 설정 컴포넌트)
    -   `components`
        -   layouts (레이아웃)
        -   views (전달용 컴포넌트)
    -   `const` (상수)
    -   `hoc`
    -   `hooks`
    -   `screens` (페이지)
    -   `store`
        -   reducer
    -   `utils`
    -   `styles`
        -   components
        -   screens
    -   `validator` (오류검사)

### apis

> -   api는 base.api를 상속받은 class를 생성하여 실행합니다
> -   각 post,put,delete,get 에는 인자로 error핸들링과 response generic이 기본적으로 필요합니다

사용예시

```Javascript
       const testDto = await LoginSvc.ready({
            SIGN_HEAD: {
                PROTOCOL_VERSION: "1.0.1",
            },
            SIGN_DATA: {
                SNS_ID: "2421158451",
                SNS_PROVIDER: "kakao",
                SNS_TOKEN: "n2hPSuuqbOtomWD4SEZF72-HVd6FK3L9k8JAdzdUCinJXgAAAYM2HvIx",
            },
        })




```

로그인 서비스 내부

```Javascript
export const LoginSvc = {
    ready: async (params: ISignReq) => {
        return await signApi.genTestSignDto(params)
        // onerror파라미터를 통해 핸들링옵션 변경가능가능
    },
}
```

---

### assets

> -   index파일에서 이미지를 require하여 객체형태로 방출

사용예시

```Javascript
export const signinImg = {
  background: require("./images/signin-background.png"),
  title: require("./images/signin-title.png"),
  subtitle: require("./images/signin-subtitle.png"),
}
```

해상도 구분

```Javascript
export const testImg = {
    coin: {
        "550-1060": require("./images/mainheader-coin-550-1060.png"),
        "650-1060": require("./images/mainheader-coin-650-1060.png"),
    },
}
```

> -   font등의 요소도 해당폴더에 포함

---

#### commons

> -   로딩, 모달등 페이지에 구애받지 않는 전역 컴포넌트는 GlobalComp.tsx로 사용
> -   그외에 추가 설정은 index에서 설정함

---

#### const

> -   상수
> -   네임은 첫글자만만 대문자로 요소는 대문자

```Javascript
export const Screen = {
  TEST: "test",
  SIGNIN: "signin",
  NFTDETAIL: "nft-detail",
} as const
```

---

#### screens

> -   폴더라우팅
>     기획을 기반으로 카테고리컬하게 생성할것
>     파일은 모두 소문자
> -   index파일을 기반으로 라우팅

---

#### styles

> -   components , screens 별로 .css.ts 파일작성

---
