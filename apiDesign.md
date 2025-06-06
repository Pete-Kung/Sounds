# Navigation

- [Navigation](#navigation)
    - [Get Token](#get-token)
    - [Sound pattern](#sound-pattern)
    - [Sound id](#sound-id)
    - [Change btn pad](#change-btn-pad)
    - [Sound controller all](#sound-controller-all)
    - [Sound controller by id](#sound-controller-by-id)
    - [Sound controller by id add](#sound-controller-by-id-add)
    - [Sound controller by id update](#sound-controller-by-id-update)
    - [Search song to generate mixer sound](#search-song-to-generate-mixer-sound)
    - [AI generate theme](#ai-generate-theme)
    - [Collect data](#collect-data)
    - [Analyze](#analyze)


### Get Token

- request

```http request
GET /v1/auth/get-token
```

- response

```json
{
  "data": {
    "accessToken": "eyJhbGciOiJSUzI1NiJ9.eyJzdWIiOiI0Iiwicm9sZXMiOlsiVVNFUiJdLCJpc3MiOiJodHRwOi8vbG9jYWxob3N0OjgwODAvdjEvYXV0aC9sb2dpbiIsImV4cCI6MTc0OTEwMjAxNCwiaWF0IjoxNzQ5MDk0ODE0LCJqdGkiOiJjODA4NDk4ZDA0NWQ0YTEzOWZmNThiNzgzYWQ2NzYwNiIsImVtYWlsIjoidXNlcjcxNjI1NEBlbWFpbC5jb20iLCJ1c2VybmFtZSI6InVzZXI3MTYyNTQifQ.JjxhTbY8-0loqPDBWUl_4N3zK3mEFi-MfQk8zvpyBk8DkolI9x8oXN-9Ylxw6KfW5iPjXA5W-mbA6qIUN0Wsrx4yLmDHR-wtZzmHC2a9hg9kpDShpPPvZNfofZ71c6gU-nr4zRpMAtgzZ1y6KvnX-ANJ_NySFbwE0F_Pj8yFp0dXt-dEULRNDWFPzmOgaLAyfscdujCK1zjqj43CYhR2d--xSuDDsEhUwylMbrJjfxaQJ3e7RKehiDbT1zjOVPSQRTZTl8Spxo4QjuH7b0_3aM45sY5QDEzcgYPv3g4w1jzUu8WH9anjJPQtJU-gZqHxJ5cDBIRhUsZjNaRph9tOAw",
    "accessExpire": 1749102014,
    "refreshToken": "c0300692-e67a-42b4-a82e-16d771027f2a",
    "refreshExpire": 1749699614
  },
  "pagination": null
}
```

### Sound pattern

- request

```http request
GET /v1/api/sounds
```

- response

```json
{
  "code": 0,
  "description": null,
  "result": {
    "soundsB": [
      {
        "id": 1,
        "name": "Drum 1",
        "file": "Drum_130_01.wav",
        "container": "padB-1",
        "btnButton": "default"
      },
      {
        "id": 2,
        "name": "Drum 2",
        "file": "Drum_130_02.wav",
        "container": "padB-1",
        "btnButton": "default"
      },
      {
        "id": 3,
        "name": "Drum 3",
        "file": "Drum_130_03.wav",
        "container": "padB-1",
        "btnButton": "default"
      },
      {
        "id": 4,
        "name": "Drum 4",
        "file": "Drum_130_04.wav",
        "container": "padB-1",
        "btnButton": "default"
      },
      {
        "id": 5,
        "name": "Bass 1",
        "file": "Bass_130_01.wav",
        "container": "padB-2",
        "btnButton": "default"
      },
      {
        "id": 6,
        "name": "Bass 2",
        "file": "Bass_130_02.wav",
        "container": "padB-2",
        "btnButton": "default"
      },
      {
        "id": 7,
        "name": "Bass 3",
        "file": "Bass_130_03.wav",
        "container": "padB-2",
        "btnButton": "default"
      },
      {
        "id": 8,
        "name": "Bass 4",
        "file": "Bass_130_04.wav",
        "container": "padB-2",
        "btnButton": "default"
      },
      {
        "id": 9,
        "name": "Pad 1",
        "file": "Pad_130_01.wav",
        "container": "padB-3",
        "btnButton": "default"
      },
      {
        "id": 10,
        "name": "Pad 2",
        "file": "Pad_130_02.wav",
        "container": "padB-3",
        "btnButton": "default"
      },
      {
        "id": 11,
        "name": "Pad 3",
        "file": "Pad_130_03.wav",
        "container": "padB-3",
        "btnButton": "default"
      },
      {
        "id": 12,
        "name": "Pad 4",
        "file": "Pad_130_04.wav",
        "container": "padB-3",
        "btnButton": "default"
      },
      {
        "id": 13,
        "name": "Synth 1",
        "file": "Synth_130_01.wav",
        "container": "padB-4",
        "btnButton": "default"
      },
      {
        "id": 14,
        "name": "Synth 2",
        "file": "Synth_130_02.wav",
        "container": "padB-4",
        "btnButton": "default"
      },
      {
        "id": 15,
        "name": "Synth 3",
        "file": "Synth_130_03.wav",
        "container": "padB-4",
        "btnButton": "default"
      },
      {
        "id": 16,
        "name": "Synth 4",
        "file": "Synth_130_04.wav",
        "container": "padB-4",
        "btnButton": "default"
      },
      {
        "id": 17,
        "name": "FX 1",
        "file": "Fx_130_01.wav",
        "container": "padB-5",
        "btnButton": "default"
      },
      {
        "id": 18,
        "name": "FX 2",
        "file": "Fx_130_02.wav",
        "container": "padB-5",
        "btnButton": "default"
      },
      {
        "id": 19,
        "name": "FX 3",
        "file": "Fx_130_03.wav",
        "container": "padB-5",
        "btnButton": "default"
      },
      {
        "id": 20,
        "name": "FX 4",
        "file": "Fx_130_04.wav",
        "container": "padB-5",
        "btnButton": "default"
      }
    ],
    "soundsC": [
      {
        "id": 1,
        "name": "Drum 1",
        "file": "JOW_126_Clubbeat1.wav",
        "container": "padC-1",
        "btnButton": "default"
      },
      {
        "id": 2,
        "name": "Drum 2",
        "file": "JOW_126_Clubbeat2.wav",
        "container": "padC-1",
        "btnButton": "default"
      },
      {
        "id": 3,
        "name": "Drum 3",
        "file": "JOW_126_ClubbeatKickClap1.wav",
        "container": "padC-1",
        "btnButton": "default"
      },
      {
        "id": 4,
        "name": "Drum 4",
        "file": "JOW_126_ClubbeatKickClap2.wav",
        "container": "padC-1",
        "btnButton": "default"
      },
      {
        "id": 5,
        "name": "Bass 1",
        "file": "JOW_126_G_BasslineAcid3.wav",
        "container": "padC-2",
        "btnButton": "default"
      },
      {
        "id": 6,
        "name": "Bass 2",
        "file": "JOW_126_G_BasslineGangster.wav",
        "container": "padC-2",
        "btnButton": "default"
      },
      {
        "id": 7,
        "name": "Bass 3",
        "file": "JOW_126_G_BasslineJX.wav",
        "container": "padC-2",
        "btnButton": "default"
      },
      {
        "id": 8,
        "name": "Bass 4",
        "file": "JOW_126_G_BasslineRipDong.wav",
        "container": "padC-2",
        "btnButton": "default"
      },
      {
        "id": 9,
        "name": "Pad 1",
        "file": "A71_Scrt-01_eLAB_Scratcher.wav",
        "container": "padC-3",
        "btnButton": "default"
      },
      {
        "id": 10,
        "name": "Pad 2",
        "file": "A71_Scrt-02_eLAB_Scratcher.wav",
        "container": "padC-3",
        "btnButton": "default"
      },
      {
        "id": 11,
        "name": "Pad 3",
        "file": "A71_Scrt-03_eLAB_Scratcher.wav",
        "container": "padC-3",
        "btnButton": "default"
      },
      {
        "id": 12,
        "name": "Pad 4",
        "file": "A71_Scrt-04_eLAB_Scratcher.wav",
        "container": "padC-3",
        "btnButton": "default"
      },
      {
        "id": 13,
        "name": "Synth 1",
        "file": "ATE2 Synth Loop - 024 - 136 BPM - Gm.wav",
        "container": "padC-4",
        "btnButton": "default"
      },
      {
        "id": 14,
        "name": "Synth 2",
        "file": "ATE2 Synth Loop - 025 - 136 BPM - Cm.wav",
        "container": "padC-4",
        "btnButton": "default"
      },
      {
        "id": 15,
        "name": "Synth 3",
        "file": "ATE2 Synth Loop - 026 - 136 BPM - Gm.wav",
        "container": "padC-4",
        "btnButton": "default"
      },
      {
        "id": 16,
        "name": "Synth 4",
        "file": "ATE2 Synth Loop - 027 - 136 BPM - Gm.wav",
        "container": "padC-4",
        "btnButton": "default"
      },
      {
        "id": 17,
        "name": "FX 1",
        "file": "US_DTH_FX_Report.wav",
        "container": "padC-5",
        "btnButton": "default"
      },
      {
        "id": 18,
        "name": "FX 2",
        "file": "US_DTH_FX_Republic.wav",
        "container": "padC-5",
        "btnButton": "default"
      },
      {
        "id": 19,
        "name": "FX 3",
        "file": "Fx_130_03.wav",
        "container": "padC-5",
        "btnButton": "default"
      },
      {
        "id": 20,
        "name": "FX 4",
        "file": "Fx_130_04.wav",
        "container": "padC-5",
        "btnButton": "default"
      }
    ],
    "soundsD": [
      {
        "id": 1,
        "name": "Drum 1",
        "file": "US_DTH_Drum_124_Bong_STRIPPED.wav",
        "container": "padD-1",
        "btnButton": "default"
      },
      {
        "id": 2,
        "name": "Drum 2",
        "file": "US_DTH_Drum_124_Block_TOP.wav",
        "container": "padD-1",
        "btnButton": "default"
      },
      {
        "id": 3,
        "name": "Drum 3",
        "file": "US_DTH_Drum_124_Bull_FULL.wav",
        "container": "padD-1",
        "btnButton": "default"
      },
      {
        "id": 4,
        "name": "Drum 4",
        "file": "US_DTH_Drum_124_Hotel_FULL.wav",
        "container": "padD-1",
        "btnButton": "default"
      },
      {
        "id": 5,
        "name": "Bass 1",
        "file": "US_DTH_Bass_124_May_Fm.wav",
        "container": "padD-2",
        "btnButton": "default"
      },
      {
        "id": 6,
        "name": "Bass 2",
        "file": "US_DTH_Bass_124_Dark_Dm.wav",
        "container": "padD-2",
        "btnButton": "default"
      },
      {
        "id": 7,
        "name": "Bass 3",
        "file": "US_DTH_Bass_124_Great_Em.wav",
        "container": "padD-2",
        "btnButton": "default"
      },
      {
        "id": 8,
        "name": "Bass 4",
        "file": "US_DTH_Bass_124_Marriage_Am.wav",
        "container": "padD-2",
        "btnButton": "default"
      },
      {
        "id": 9,
        "name": "Pad 1",
        "file": "US_DTH_Pad_124_Future.wav",
        "container": "padD-3",
        "btnButton": "default"
      },
      {
        "id": 10,
        "name": "Pad 2",
        "file": "US_DTH_Pad_124_Gazzelle.wav",
        "container": "padD-3",
        "btnButton": "default"
      },
      {
        "id": 11,
        "name": "Pad 3",
        "file": "US_DTH_Pad_124_Pray.wav",
        "container": "padD-3",
        "btnButton": "default"
      },
      {
        "id": 12,
        "name": "Pad 4",
        "file": "US_DTH_Pad_124_Remesh.wav",
        "container": "padD-3",
        "btnButton": "default"
      },
      {
        "id": 13,
        "name": "Synth 1",
        "file": "US_DTH_Synth_124_Again.wav",
        "container": "padD-4",
        "btnButton": "default"
      },
      {
        "id": 14,
        "name": "Synth 2",
        "file": "US_DTH_Synth_124_Agree_G.wav",
        "container": "padD-4",
        "btnButton": "default"
      },
      {
        "id": 15,
        "name": "Synth 3",
        "file": "US_DTH_Synth_124_Begin.wav",
        "container": "padD-4",
        "btnButton": "default"
      },
      {
        "id": 16,
        "name": "Synth 4",
        "file": "US_DTH_Synth_124_Brother_Fm.wav",
        "container": "padD-4",
        "btnButton": "default"
      },
      {
        "id": 17,
        "name": "FX 1",
        "file": "US_DTH_FX_Venice.wav",
        "container": "padD-5",
        "btnButton": "default"
      },
      {
        "id": 18,
        "name": "FX 2",
        "file": "US_DTH_FX_Result.wav",
        "container": "padD-5",
        "btnButton": "default"
      },
      {
        "id": 19,
        "name": "FX 3",
        "file": "US_DTH_FX_USA.wav",
        "container": "padD-5",
        "btnButton": "default"
      },
      {
        "id": 20,
        "name": "FX 4",
        "file": "US_DTH_FX_National.wav",
        "container": "padD-5",
        "btnButton": "default"
      }
    ]
  },
  "records": null
}
```

### Sound id

- request

```
id ==> a,b,c,d
```

```http request
GET /v1/api/sounds/{id}
```

- response

```json
{
  "code": 0,
  "description": null,
  "result": {
    "soundsB": [
      {
        "id": 1,
        "name": "Drum 1",
        "file": "Drum_130_01.wav",
        "container": "padB-1",
        "btnButton": "default"
      },
      {
        "id": 2,
        "name": "Drum 2",
        "file": "Drum_130_02.wav",
        "container": "padB-1",
        "btnButton": "default"
      },
      {
        "id": 3,
        "name": "Drum 3",
        "file": "Drum_130_03.wav",
        "container": "padB-1",
        "btnButton": "default"
      },
      {
        "id": 4,
        "name": "Drum 4",
        "file": "Drum_130_04.wav",
        "container": "padB-1",
        "btnButton": "default"
      },
      {
        "id": 5,
        "name": "Bass 1",
        "file": "Bass_130_01.wav",
        "container": "padB-2",
        "btnButton": "default"
      },
      {
        "id": 6,
        "name": "Bass 2",
        "file": "Bass_130_02.wav",
        "container": "padB-2",
        "btnButton": "default"
      },
      {
        "id": 7,
        "name": "Bass 3",
        "file": "Bass_130_03.wav",
        "container": "padB-2",
        "btnButton": "default"
      },
      {
        "id": 8,
        "name": "Bass 4",
        "file": "Bass_130_04.wav",
        "container": "padB-2",
        "btnButton": "default"
      },
      {
        "id": 9,
        "name": "Pad 1",
        "file": "Pad_130_01.wav",
        "container": "padB-3",
        "btnButton": "default"
      },
      {
        "id": 10,
        "name": "Pad 2",
        "file": "Pad_130_02.wav",
        "container": "padB-3",
        "btnButton": "default"
      },
      {
        "id": 11,
        "name": "Pad 3",
        "file": "Pad_130_03.wav",
        "container": "padB-3",
        "btnButton": "default"
      },
      {
        "id": 12,
        "name": "Pad 4",
        "file": "Pad_130_04.wav",
        "container": "padB-3",
        "btnButton": "default"
      },
      {
        "id": 13,
        "name": "Synth 1",
        "file": "Synth_130_01.wav",
        "container": "padB-4",
        "btnButton": "default"
      },
      {
        "id": 14,
        "name": "Synth 2",
        "file": "Synth_130_02.wav",
        "container": "padB-4",
        "btnButton": "default"
      },
      {
        "id": 15,
        "name": "Synth 3",
        "file": "Synth_130_03.wav",
        "container": "padB-4",
        "btnButton": "default"
      },
      {
        "id": 16,
        "name": "Synth 4",
        "file": "Synth_130_04.wav",
        "container": "padB-4",
        "btnButton": "default"
      },
      {
        "id": 17,
        "name": "FX 1",
        "file": "Fx_130_01.wav",
        "container": "padB-5",
        "btnButton": "default"
      },
      {
        "id": 18,
        "name": "FX 2",
        "file": "Fx_130_02.wav",
        "container": "padB-5",
        "btnButton": "default"
      },
      {
        "id": 19,
        "name": "FX 3",
        "file": "Fx_130_03.wav",
        "container": "padB-5",
        "btnButton": "default"
      },
      {
        "id": 20,
        "name": "FX 4",
        "file": "Fx_130_04.wav",
        "container": "padB-5",
        "btnButton": "default"
      }
    ]
  },
  "records": null
}
```

### Change btn pad

- request

```
idsound ==> a,b,c,d
id ===> 1-20
```

```http request
PUT /v1/api/sounds/{idsound}/{id}
Content-Type: application/json
```

```json
{ "btnButton": "XXXX" }
```

### Sound controller all

- request


```http request
GET /v1/api/controller/
```

- response

```json
{
  "code": 0,
  "description": null,
  "result": {
    "controllerA" :  [
    {
      "id": 1,
      "btnType": "A-1",
      "label": "Drum",
      "x": "1185px",
      "y": "155px"
    },
    {
      "id": 2,
      "btnType": "A-2",
      "label": "Bass",
      "x": "588px",
      "y": "188px"
    },
    {
      "id": 3,
      "btnType": "A-3",
      "label": "Pad",
      "x": "575px",
      "y": "63px"
    },
    {
      "id": 4,
      "btnType": "A-4",
      "label": "Synth",
      "x": "61px",
      "y": "74px"
    },
    {
      "id": 5,
      "btnType": "A-5",
      "label": "Fx",
      "x": "61px",
      "y": "74px"
    }
  ],
  "controllerB" :  null,
  "controllerC" :  null,
  "controllerD" :  null,


    
  },
  "records": null
}
```
- note
```
default all controller  == null
``` 

### Sound controller by id

- request

```
id ==> a,b,c,d
```

```http request
GET /v1/api/controller/{id}
```

- response

```json
{
  "code": 0,
  "description": null,
  "result": [
    {
      "id": 1,
      "btnType": "A-1",
      "label": "Drum",
      "x": "1185px",
      "y": "155px"
    },
    {
      "id": 2,
      "btnType": "A-2",
      "label": "Bass",
      "x": "588px",
      "y": "188px"
    },
    {
      "id": 3,
      "btnType": "A-3",
      "label": "Pad",
      "x": "575px",
      "y": "63px"
    },
    {
      "id": 4,
      "btnType": "A-4",
      "label": "Synth",
      "x": "61px",
      "y": "74px"
    },
    {
      "id": 5,
      "btnType": "A-5",
      "label": "Fx",
      "x": "61px",
      "y": "74px"
    }
  ],
  "records": null
}
```

### Sound controller by id add


- request

```
id ==> a,b,c,d
```

```http request
PUT /v1/api/controller/{id}
```



```json
{
  "code": 0,
  "description": null,
  "result": [
    {
      "id": 1,
      "btnType": "A-1",
      "label": "Drum",
      "x": "1185px",
      "y": "155px"
    },
    {
      "id": 2,
      "btnType": "A-2",
      "label": "Bass",
      "x": "588px",
      "y": "188px"
    },
    {
      "id": 3,
      "btnType": "A-3",
      "label": "Pad",
      "x": "575px",
      "y": "63px"
    },
    {
      "id": 4,
      "btnType": "A-4",
      "label": "Synth",
      "x": "61px",
      "y": "74px"
    },
    {
      "id": 5,
      "btnType": "A-5",
      "label": "Fx",
      "x": "61px",
      "y": "74px"
    },
    ...
  ],
  "records": null
}
```


### Sound controller by id update



- request

```
id ==> a,b,c,d
เอาชุดใหม่ที่สร้างไปแทนอันเก่า
```

```http request
PATCH /v1/api/controller/{id}
```



```json
{
  "code": 0,
  "description": null,
  "result": [
    {
      "id": 1,
      "btnType": "XXX",
      "label": "Drum",
      "x": "XXX",
      "y": "XXX"
    },
    {
      "id": 2,
      "btnType": "A-2",
      "label": "XXX",
      "x": "XXX",
      "y": "XXX"
    },
    {
      "id": 3,
      "btnType": "XXX",
      "label": "Pad",
      "x": "XXX",
      "y": "XXX"
    },
    {
      "id": 4,
      "btnType": "XXX",
      "label": "Synth",
      "x": "XXX",
      "y": "XXX"
    },
    {
      "id": 5,
      "btnType": "XXX",
      "label": "Fx",
      "x": "XXX",
      "y": "XXX"
    },
    ...
  ],
  "records": null
}
```



### Search song to generate mixer sound

- request


```http request
POST /v1/api/generate/
{
  songName : "I love you  so"
}
```

- response

```

{
  "code": 0,
  "description": null,
  "result": {
    "soundsB": [
      {
        "id": 1,
        "name": "Drum 1",
        "file": "XXXX.wav",
        "container": "padB-1",
        "btnButton": "default"
      },
      {
        "id": 2,
        "name": "Drum 2",
        "file": "XXXX.wav",
        "container": "padB-1",
        "btnButton": "default"
      },
      {
        "id": 3,
        "name": "Drum 3",
        "file": "XXXX.wav",
        "container": "padB-1",
        "btnButton": "default"
      },
      ...
    ],
    soundsC : [
      ...
    ],
    soundsD : [
      ...
    ],


   
  },
  "records": null
}

```

- note
```
ส่วนที่เป็น file audio A,B,C,D  จะเปลี่ยนไปตามเพลงหรือรูปแบบสไตล์ที่ต้องการ
```

### AI generate theme

```http request
POST /v1/api/generate/
{
  theme : "love pink"
}
```


- response

```

{
  "code": 0,
  "description": null,
  "result": {
    "themeA": {
      "color1": "#e57373",
      "color2": "#f06292",
      "color3": "#ba68c8",
      "color4": "#9575cd",
      "color5": "#7986cb"
    },
    "themeB": {
      "color1": "#4db6ac",
      "color2": "#4dd0e1",
      "color3": "#4fc3f7",
      "color4": "#64b5f6",
      "color5": "#90caf9"
    },
    "themeC": {
      "color1": "#aed581",
      "color2": "#dce775",
      "color3": "#fff176",
      "color4": "#ffd54f",
      "color5": "#ffb74d"
    },
    "themeD": {
      "color1": "#a1887f",
      "color2": "#bcaaa4",
      "color3": "#eeeeee",
      "color4": "#b0bec5",
      "color5": "#78909c"
    }
  },
  "records": null
}


```


### Collect data

```http request
POST /v1/mixer-logs/event

// event adjust volume
{
  "eventType": "VOLUME_ADJUST",
  "mixerPad": "B",
  "presetName": "Trap",
  "bpm": 120,
  "drumVolume": 39,
  "bassVolume": 100,
  "padVolume": 100,
  "synthVolume": 100,
  "fxVolume": 100
}

// event adjust bpm
{
  "eventType": "BPM_ADJUST",
  "mixerPad": "B",
  "bpm": 120
}

// event select preset
{
  "eventType": "PRESET_SELECT",
  "mixerPad": "C",
  "presetName": "HipHop"
}

// event stop all
{
  "eventType": "STOP_ALL",
  "mixerPad": "C"
}

// event pad click
{
  "eventType": "PAD_CLICK",
  "mixerPad": "C",
  "padId": "Drum 3",
  "padType": "Drum"
}

// event fx click
{
  "eventType": "FX_CLICK",
  "mixerPad": "C",
  "padId": "FX 4",
  "padType": "FX"
}
```

### Analyze

- request

```http request
POST /v1/mixer-logs/analyze
```

- response

```http request
{
  "data": "…",
  "pagination": null
}
```