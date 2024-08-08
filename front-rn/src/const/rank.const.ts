import { jsonSvc } from "apis/services"

export const rankKey = [
    { title: jsonSvc.findLocalById("140010") },
    { title: jsonSvc.findLocalById("110200") },
    { title: jsonSvc.findLocalById("110201") },
    { title: jsonSvc.formatLocal(jsonSvc.findLocalById("110211"), [jsonSvc.findLocalById("110212")]) },
    { title: jsonSvc.formatLocal(jsonSvc.findLocalById("110211"), [jsonSvc.findLocalById("110213")]) },
    { title: jsonSvc.formatLocal(jsonSvc.findLocalById("110211"), [jsonSvc.findLocalById("110214")]) },
    { title: jsonSvc.formatLocal(jsonSvc.findLocalById("110211"), [jsonSvc.findLocalById("110215")]) },
    { title: jsonSvc.formatLocal(jsonSvc.findLocalById("110211"), [jsonSvc.findLocalById("110216")]) },
    { title: jsonSvc.formatLocal(jsonSvc.findLocalById("110211"), [jsonSvc.findLocalById("110217")]) },
    { title: jsonSvc.formatLocal(jsonSvc.findLocalById("110211"), [jsonSvc.findLocalById("110218")]) },
]
export enum TabIndex {
    FAN = "pandetail",
    PRO = "prodetail",
}
export enum FanSubIndex {
    MOSTFAN,
    DONATEAMOUNT,
    DONATECOUNT,
    HEARTAMOUT,
    PROFILEUP,
}
export enum ProSubIndex {
    EARNAMOUNT,
    DONATECOUNT,
    HEARTAMOUT,
    PROFILEUP,
}
