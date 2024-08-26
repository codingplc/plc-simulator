import { Store } from "../interface";

export const SAMPLE_DRAFT: Store = {
  runglist: [
    "54354e01-b16d-4e1c-baa9-66dfff5b630d",
    "34f73e42-58e5-401b-b207-685a8e2af1b2",
    "4af16cdf-f5f5-4f02-9593-30a2b959b2af",
    "79d7ea3a-c5d7-49b2-ab00-aab7a9700d8c",
    "646b1d58-1615-4d9d-9002-66faa3d546a0",
    "cd2e5926-1b2b-462f-80d9-cd2cf801d5f1",
    "aeaefba8-009f-4f5f-a6d5-62a5d58f84af",
    "d9aa19ac-92e3-4dd4-b38b-adfd48cffe2b",
  ],
  rungs: {
    "646b1d58-1615-4d9d-9002-66faa3d546a0": {
      elements: [
        "27916029-2ff0-45c6-8c8e-83df3864e0bf",
        "03aff48a-a435-4bfe-b0a2-dd22746e6cf0",
        "ce73e600-f89b-49e2-b555-5749a0f135ce",
      ],
      comment: "",
      out: false,
      input: true,
    },
    "cd2e5926-1b2b-462f-80d9-cd2cf801d5f1": {
      comment: "",
      elements: ["9d8cb364-2377-447d-b248-a123f15f2b3d", "6333825f-08bb-4b37-aa79-3dd6711ac579"],
      input: true,
      out: false,
    },
    "aeaefba8-009f-4f5f-a6d5-62a5d58f84af": {
      comment: "",
      elements: ["e09f5e37-a8ea-48cb-b804-8693a5c68c9a", "9a169b83-f7b4-476c-9347-d5c25fb9b4e1"],
      input: true,
      out: false,
    },
    "d9aa19ac-92e3-4dd4-b38b-adfd48cffe2b": {
      comment: "",
      elements: ["3d68657d-4cb4-4cac-9d1a-f7eaf38c0269", "23747422-9af3-4c4b-a594-6c3b06fd46b3"],
      input: true,
      out: false,
    },
    "54354e01-b16d-4e1c-baa9-66dfff5b630d": {
      comment: "",
      elements: ["05806215-fc0f-47fe-8c91-4056ac3c37e1", "14546c9d-0312-4646-8c7a-893ad889493e"],
      input: true,
      out: false,
    },
    "34f73e42-58e5-401b-b207-685a8e2af1b2": {
      comment: "",
      elements: ["a0af9d7b-edf0-4b04-a44c-3fce803ce181", "52a5382a-d33b-422c-8572-fb7db3063e51"],
      input: true,
      out: false,
    },
    "4af16cdf-f5f5-4f02-9593-30a2b959b2af": {
      comment: "",
      elements: [
        "17534c11-db91-4aab-b8f7-de39fe0c7404",
        "efdf5071-4dff-4767-b927-7fcebb152e35",
        "abfc01fd-31ea-41e2-a81c-76d665025532",
      ],
      input: true,
      out: false,
    },
    "79d7ea3a-c5d7-49b2-ab00-aab7a9700d8c": {
      comment: "",
      elements: ["4be87ec7-0b77-42df-9218-e1f2f9b09a77", "909f6837-6cf8-4ae6-a0fb-dc8dc6de8b55"],
      input: true,
      out: true,
    },
    "5ef8332a-1492-4df6-b78f-42f8cb564219": {
      comment: "",
      elements: ["817fea58-6773-4e9f-95cc-d62e367617cd", "fb1afdc8-61a3-44f2-a59f-20f4804de05f"],
      input: true,
      out: false,
    },
    "1ce64a77-a388-4fad-95be-6ee774242543": {
      comment: "",
      elements: ["5f7928e8-d964-49d1-a65f-00d65808d7fa"],
      input: true,
      out: true,
    },
  },
  branches: {
    "4be87ec7-0b77-42df-9218-e1f2f9b09a77": {
      rungs: ["5ef8332a-1492-4df6-b78f-42f8cb564219", "1ce64a77-a388-4fad-95be-6ee774242543"],
      input: true,
      out: true,
    },
  },
  elements: {
    "ce73e600-f89b-49e2-b555-5749a0f135ce": {
      configured: true,
      type: "TON",
      out: false,
      parameters: {
        inOut: [
          {
            type: ["Timer"],
            uuid: "43bc8db5-3b7e-4a16-9a0a-72aa74ba8585",
          },
        ],
      },
    },
    "03aff48a-a435-4bfe-b0a2-dd22746e6cf0": {
      configured: true,
      memInput: false,
      out: false,
      parameters: {
        input: [
          {
            type: ["Bool"],
            uuid: "acd5e52e-d5bf-43c5-a58f-0917ebdca340",
          },
        ],
      },
      type: "XIO",
    },
    "6333825f-08bb-4b37-aa79-3dd6711ac579": {
      configured: true,
      out: false,
      parameters: {
        output: [
          {
            type: ["Bool"],
            uuid: "825b6ace-e837-475a-a8bf-8ffa3daa6356",
          },
        ],
      },
      type: "OTE",
    },
    "9a169b83-f7b4-476c-9347-d5c25fb9b4e1": {
      configured: true,
      out: false,
      parameters: {
        output: [
          {
            type: ["Bool"],
            uuid: "eb75dffb-edb1-4a72-9629-a8676f1ff6eb",
          },
        ],
      },
      type: "OTE",
    },
    "23747422-9af3-4c4b-a594-6c3b06fd46b3": {
      configured: true,
      out: false,
      parameters: {
        output: [
          {
            type: ["Bool"],
            uuid: "cd4fbe49-e625-47c5-8b5b-1e6b45918320",
          },
        ],
      },
      type: "OTE",
    },
    "9d8cb364-2377-447d-b248-a123f15f2b3d": {
      configured: true,
      out: false,
      parameters: {
        input: [
          {
            type: ["Number", "Time"],
            uuid: "aee891a0-7972-4f4e-959e-975c421f3427",
          },
          {
            type: ["Number", "Time"],
            uuid: "ee36c674-6397-4e5c-95b2-da79ebbb937e",
          },
        ],
      },
      type: "GEQ",
    },
    "e09f5e37-a8ea-48cb-b804-8693a5c68c9a": {
      configured: true,
      out: false,
      parameters: {
        input: [
          {
            type: ["Number", "Time"],
            uuid: "aee891a0-7972-4f4e-959e-975c421f3427",
          },
          {
            type: ["Number", "Time"],
            uuid: "9507fc08-2ed5-4cd9-b11a-549c8eda0b81",
          },
        ],
      },
      type: "GEQ",
    },
    "3d68657d-4cb4-4cac-9d1a-f7eaf38c0269": {
      configured: true,
      out: false,
      parameters: {
        input: [
          {
            type: ["Number", "Time"],
            uuid: "aee891a0-7972-4f4e-959e-975c421f3427",
          },
          {
            type: ["Number", "Time"],
            uuid: "7064a440-751b-484c-ad7e-3219ee53f5d1",
          },
        ],
      },
      type: "GEQ",
    },
    "27916029-2ff0-45c6-8c8e-83df3864e0bf": {
      configured: true,
      memInput: false,
      out: false,
      parameters: {
        input: [
          {
            type: ["Bool"],
            uuid: "1bbe2d5e-2b55-426e-9c4e-90f72f510098",
          },
        ],
      },
      type: "XIC",
    },
    "05806215-fc0f-47fe-8c91-4056ac3c37e1": {
      configured: true,
      memInput: false,
      out: false,
      parameters: {
        input: [
          {
            type: ["Bool"],
            uuid: "0e372f26-f7fb-461d-9273-da25dd2529a6",
          },
        ],
      },
      type: "OSP",
    },
    "14546c9d-0312-4646-8c7a-893ad889493e": {
      configured: true,
      out: false,
      parameters: {
        output: [
          {
            type: ["Bool"],
            uuid: "1bbe2d5e-2b55-426e-9c4e-90f72f510098",
          },
        ],
      },
      type: "OTL",
    },
    "52a5382a-d33b-422c-8572-fb7db3063e51": {
      configured: true,
      out: false,
      parameters: {
        output: [
          {
            type: ["Bool"],
            uuid: "1bbe2d5e-2b55-426e-9c4e-90f72f510098",
          },
        ],
      },
      type: "OTU",
    },
    "a0af9d7b-edf0-4b04-a44c-3fce803ce181": {
      configured: true,
      memInput: false,
      out: false,
      parameters: {
        input: [
          {
            type: ["Bool"],
            uuid: "dedc0fcb-1bda-4bcc-8250-59b1e931d179",
          },
        ],
      },
      type: "XIC",
    },
    "17534c11-db91-4aab-b8f7-de39fe0c7404": {
      configured: true,
      memInput: false,
      out: false,
      parameters: {
        input: [
          {
            type: ["Bool"],
            uuid: "0e372f26-f7fb-461d-9273-da25dd2529a6",
          },
        ],
      },
      type: "XIC",
    },
    "efdf5071-4dff-4767-b927-7fcebb152e35": {
      configured: true,
      memInput: false,
      prevCU: false,
      prevCD: false,
      out: false,
      parameters: {
        inOut: [
          {
            type: ["Counter"],
            uuid: "4bb64120-258c-4592-b5af-82fd633a1b34",
          },
        ],
      },
      type: "CTU",
    },
    "abfc01fd-31ea-41e2-a81c-76d665025532": {
      configured: true,
      out: false,
      parameters: {
        output: [
          {
            type: ["Bool"],
            uuid: "dedc0fcb-1bda-4bcc-8250-59b1e931d179",
          },
        ],
      },
      type: "OTE",
    },
    "909f6837-6cf8-4ae6-a0fb-dc8dc6de8b55": {
      configured: true,
      out: true,
      parameters: {
        output: [
          {
            type: ["Bool"],
            uuid: "74955e32-251e-43ae-83d8-d59514471241",
          },
        ],
      },
      type: "OTE",
    },
    "fb1afdc8-61a3-44f2-a59f-20f4804de05f": {
      configured: true,
      type: "TON",
      out: false,
      parameters: {
        inOut: [
          {
            type: ["Timer"],
            uuid: "bf60348b-99e6-4ae2-b422-adaea18ba3a1",
          },
        ],
      },
    },
    "817fea58-6773-4e9f-95cc-d62e367617cd": {
      configured: true,
      out: false,
      parameters: {
        input: [
          {
            type: ["Number", "Time"],
            uuid: "dc3399ee-533f-48d7-90f7-2dc90bb0f96d",
          },
          {
            type: ["Number", "Time"],
            uuid: "61c0117e-d154-45c5-9802-c74fe86713ac",
          },
        ],
      },
      type: "GRT",
    },
    "5f7928e8-d964-49d1-a65f-00d65808d7fa": {
      configured: true,
      memInput: false,
      out: true,
      parameters: {
        input: [
          {
            type: ["Bool"],
            uuid: "1bbe2d5e-2b55-426e-9c4e-90f72f510098",
          },
        ],
      },
      type: "XIO",
    },
  },
  variables: {
    "43bc8db5-3b7e-4a16-9a0a-72aa74ba8585": {
      name: "Cycle",
      parrent: "",
      type: "Timer",
      usedBy: ["ce73e600-f89b-49e2-b555-5749a0f135ce"],
      subVars: {
        PT: "258eff09-669b-411e-9ec6-2aac779a42ea",
        ET: "aee891a0-7972-4f4e-959e-975c421f3427",
        IN: "a3c29fd3-6105-487e-a651-5f1903d58eb7",
        R: "a81b3570-e694-479d-9c25-9fd618f9feaa",
        Q: "acd5e52e-d5bf-43c5-a58f-0917ebdca340",
      },
      value: null,
    },
    "258eff09-669b-411e-9ec6-2aac779a42ea": {
      name: "Cycle.PT",
      parrent: "43bc8db5-3b7e-4a16-9a0a-72aa74ba8585",
      type: "Time",
      usedBy: [],
      value: 16000,
      subVars: {},
    },
    "aee891a0-7972-4f4e-959e-975c421f3427": {
      name: "Cycle.ET",
      parrent: "43bc8db5-3b7e-4a16-9a0a-72aa74ba8585",
      type: "Time",
      usedBy: ["9d8cb364-2377-447d-b248-a123f15f2b3d", "e09f5e37-a8ea-48cb-b804-8693a5c68c9a"],
      value: 0,
      subVars: {},
    },
    "a3c29fd3-6105-487e-a651-5f1903d58eb7": {
      name: "Cycle.IN",
      parrent: "43bc8db5-3b7e-4a16-9a0a-72aa74ba8585",
      type: "Bool",
      usedBy: [],
      value: false,
      subVars: {},
    },
    "a81b3570-e694-479d-9c25-9fd618f9feaa": {
      name: "Cycle.R",
      parrent: "43bc8db5-3b7e-4a16-9a0a-72aa74ba8585",
      type: "Bool",
      usedBy: [],
      value: false,
      subVars: {},
    },
    "acd5e52e-d5bf-43c5-a58f-0917ebdca340": {
      name: "Cycle.Q",
      parrent: "43bc8db5-3b7e-4a16-9a0a-72aa74ba8585",
      type: "Bool",
      usedBy: ["03aff48a-a435-4bfe-b0a2-dd22746e6cf0"],
      value: false,
      subVars: {},
    },
    "825b6ace-e837-475a-a8bf-8ffa3daa6356": {
      name: "Z0",
      parrent: "",
      type: "Bool",
      value: false,
      usedBy: ["6333825f-08bb-4b37-aa79-3dd6711ac579"],
      subVars: {},
    },
    "eb75dffb-edb1-4a72-9629-a8676f1ff6eb": {
      name: "Z1",
      parrent: "",
      type: "Bool",
      value: false,
      usedBy: ["9a169b83-f7b4-476c-9347-d5c25fb9b4e1"],
      subVars: {},
    },
    "cd4fbe49-e625-47c5-8b5b-1e6b45918320": {
      name: "Z2",
      parrent: "",
      type: "Bool",
      value: false,
      usedBy: ["23747422-9af3-4c4b-a594-6c3b06fd46b3"],
      subVars: {},
    },
    "0e372f26-f7fb-461d-9273-da25dd2529a6": {
      name: "X0",
      parrent: "",
      type: "Bool",
      value: false,
      usedBy: ["05806215-fc0f-47fe-8c91-4056ac3c37e1", "17534c11-db91-4aab-b8f7-de39fe0c7404"],
      subVars: {},
    },
    "ee36c674-6397-4e5c-95b2-da79ebbb937e": {
      name: "TimeOnZ0",
      parrent: "",
      type: "Time",
      value: 3000,
      usedBy: ["9d8cb364-2377-447d-b248-a123f15f2b3d"],
      subVars: {},
    },
    "9507fc08-2ed5-4cd9-b11a-549c8eda0b81": {
      name: "TimeOnZ1",
      parrent: "",
      type: "Time",
      value: 5000,
      usedBy: ["e09f5e37-a8ea-48cb-b804-8693a5c68c9a"],
      subVars: {},
    },
    "7064a440-751b-484c-ad7e-3219ee53f5d1": {
      name: "TimeOnZ2",
      parrent: "",
      type: "Time",
      value: 7000,
      usedBy: ["3d68657d-4cb4-4cac-9d1a-f7eaf38c0269"],
      subVars: {},
    },
    "1bbe2d5e-2b55-426e-9c4e-90f72f510098": {
      name: "SystemOn",
      parrent: "",
      type: "Bool",
      value: false,
      usedBy: [
        "27916029-2ff0-45c6-8c8e-83df3864e0bf",
        "14546c9d-0312-4646-8c7a-893ad889493e",
        "52a5382a-d33b-422c-8572-fb7db3063e51",
        "5f7928e8-d964-49d1-a65f-00d65808d7fa",
      ],
      subVars: {},
    },
    "bf60348b-99e6-4ae2-b422-adaea18ba3a1": {
      name: "2ClkTmr",
      parrent: "",
      type: "Timer",
      usedBy: ["fb1afdc8-61a3-44f2-a59f-20f4804de05f"],
      subVars: {
        PT: "fa682996-e845-4558-b8f4-9742ce0fc764",
        ET: "df49748e-c7e5-4381-aa27-0c08d8c9f4ae",
        IN: "0430b9af-0bd3-492c-83ac-5eb9a7cc9d95",
        R: "10ce61d2-840c-4a48-b9ac-4c8ea1d1c21c",
        Q: "266281a9-9774-4c43-a63a-a6d8a49a903f",
      },
      value: null,
    },
    "fa682996-e845-4558-b8f4-9742ce0fc764": {
      name: "2ClkTmr.PT",
      parrent: "bf60348b-99e6-4ae2-b422-adaea18ba3a1",
      type: "Time",
      usedBy: [],
      value: 5000,
      subVars: {},
    },
    "df49748e-c7e5-4381-aa27-0c08d8c9f4ae": {
      name: "2ClkTmr.ET",
      parrent: "bf60348b-99e6-4ae2-b422-adaea18ba3a1",
      type: "Time",
      usedBy: [],
      value: 0,
      subVars: {},
    },
    "0430b9af-0bd3-492c-83ac-5eb9a7cc9d95": {
      name: "2ClkTmr.IN",
      parrent: "bf60348b-99e6-4ae2-b422-adaea18ba3a1",
      type: "Bool",
      usedBy: [],
      value: false,
      subVars: {},
    },
    "10ce61d2-840c-4a48-b9ac-4c8ea1d1c21c": {
      name: "2ClkTmr.R",
      parrent: "bf60348b-99e6-4ae2-b422-adaea18ba3a1",
      type: "Bool",
      usedBy: [],
      value: false,
      subVars: {},
    },
    "266281a9-9774-4c43-a63a-a6d8a49a903f": {
      name: "2ClkTmr.Q",
      parrent: "bf60348b-99e6-4ae2-b422-adaea18ba3a1",
      type: "Bool",
      usedBy: [],
      value: false,
      subVars: {},
    },
    "4bb64120-258c-4592-b5af-82fd633a1b34": {
      name: "Counter",
      parrent: "",
      type: "Counter",
      usedBy: ["efdf5071-4dff-4767-b927-7fcebb152e35"],
      subVars: {
        PV: "c1e1894e-3143-4050-9fb1-9f0beb9c618b",
        CV: "dc3399ee-533f-48d7-90f7-2dc90bb0f96d",
        CU: "691698c5-3bfe-423a-aa24-d0a41a4d6bc6",
        CD: "0171543d-1702-4923-9173-9bcdfc1e3773",
        R: "74955e32-251e-43ae-83d8-d59514471241",
        LD: "9b206219-ba26-4ff3-b26d-21943f2c6b05",
        QU: "3d51499d-ed83-4e78-9bc5-ee6756bf002b",
        QD: "6bc4df33-894f-4479-8b8f-21a0fedbbea5",
      },
      value: null,
    },
    "c1e1894e-3143-4050-9fb1-9f0beb9c618b": {
      name: "Counter.PV",
      parrent: "4bb64120-258c-4592-b5af-82fd633a1b34",
      type: "Number",
      usedBy: [],
      value: 2,
      subVars: {},
    },
    "dc3399ee-533f-48d7-90f7-2dc90bb0f96d": {
      name: "Counter.CV",
      parrent: "4bb64120-258c-4592-b5af-82fd633a1b34",
      type: "Number",
      usedBy: ["817fea58-6773-4e9f-95cc-d62e367617cd"],
      value: 0,
      subVars: {},
    },
    "691698c5-3bfe-423a-aa24-d0a41a4d6bc6": {
      name: "Counter.CU",
      parrent: "4bb64120-258c-4592-b5af-82fd633a1b34",
      type: "Bool",
      usedBy: [],
      value: false,
      subVars: {},
    },
    "0171543d-1702-4923-9173-9bcdfc1e3773": {
      name: "Counter.CD",
      parrent: "4bb64120-258c-4592-b5af-82fd633a1b34",
      type: "Bool",
      usedBy: [],
      value: false,
      subVars: {},
    },
    "74955e32-251e-43ae-83d8-d59514471241": {
      name: "Counter.R",
      parrent: "4bb64120-258c-4592-b5af-82fd633a1b34",
      type: "Bool",
      usedBy: ["909f6837-6cf8-4ae6-a0fb-dc8dc6de8b55"],
      value: true,
      subVars: {},
    },
    "9b206219-ba26-4ff3-b26d-21943f2c6b05": {
      name: "Counter.LD",
      parrent: "4bb64120-258c-4592-b5af-82fd633a1b34",
      type: "Bool",
      usedBy: [],
      value: false,
      subVars: {},
    },
    "3d51499d-ed83-4e78-9bc5-ee6756bf002b": {
      name: "Counter.QU",
      parrent: "4bb64120-258c-4592-b5af-82fd633a1b34",
      type: "Bool",
      usedBy: [],
      value: false,
      subVars: {},
    },
    "6bc4df33-894f-4479-8b8f-21a0fedbbea5": {
      name: "Counter.QD",
      parrent: "4bb64120-258c-4592-b5af-82fd633a1b34",
      type: "Bool",
      usedBy: [],
      value: false,
      subVars: {},
    },
    "dedc0fcb-1bda-4bcc-8250-59b1e931d179": {
      name: "2Clicks",
      parrent: "",
      type: "Bool",
      value: false,
      usedBy: ["a0af9d7b-edf0-4b04-a44c-3fce803ce181", "abfc01fd-31ea-41e2-a81c-76d665025532"],
      subVars: {},
    },
    "61c0117e-d154-45c5-9802-c74fe86713ac": {
      name: "0",
      parrent: "",
      type: "Number",
      value: 0,
      usedBy: ["817fea58-6773-4e9f-95cc-d62e367617cd"],
      subVars: {},
    },
  },
  misc: {
    displayTab: "diagram",
  },
  temp: {
    alertSnackbar: { color: "info", open: true, text: "Sample diagram loaded." },
    canUndo: false,
    canRedo: false,
    diagramSaved: false,
    openElementProps: false,
    simulation: false,
    selectedUuid: "",
  },
};

export const INITIAL_DRAFT: Store = {
  runglist: ["646b1d58-1615-4d9d-9002-66faa3d546a0"],
  rungs: {
    "646b1d58-1615-4d9d-9002-66faa3d546a0": {
      elements: [],
      comment: "",
      out: false,
      input: false,
    },
  },
  branches: {},
  elements: {},
  variables: {},
  misc: {
    displayTab: "diagram",
  },
  temp: {
    alertSnackbar: { color: "info", open: false, text: "Initial diagram loaded." },
    canUndo: false,
    canRedo: false,
    diagramSaved: false,
    openElementProps: false,
    simulation: false,
    selectedUuid: "",
  },
};

export const migrations = {
  1: () => {
    return { simulator: SAMPLE_DRAFT };
  },
  2: () => {
    return { simulator: SAMPLE_DRAFT };
  },
  3: () => {
    return { ...SAMPLE_DRAFT };
  },
};
