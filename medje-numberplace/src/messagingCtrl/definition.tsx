// 接続先情報定義
const schema = "http:"
const requestDomain = "localhost";

const requestPort = "55555";

export const baseUrl =  (!requestPort) ? schema + "//" + requestDomain : 
                                         schema + "//" + requestDomain + ":" + requestPort;
