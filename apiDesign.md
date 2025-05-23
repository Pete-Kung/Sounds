# Navigation

- [Get sounds](#sound-pattern)
  - [get sounds all](#sound-pattern)
  - [get sounds by id](#sound-id)
  - [chang btn pad](#change-btn-pad)
  - [sound controller all](#sound-controller-all)
  - [sound controller by id](#sound-controller-by-id)
  - [sound controller by id add](#sound-controller-by-id-add)
  - [sound controller by id update](#sound-controller-by-id-update)


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