import { ABaseScv } from "./base.svc"
import { SystemApi } from "apis/context/system.api"

class SystemSvc extends ABaseScv<SystemSvc>() {
    private readonly systemApi = new SystemApi()
    
    getOsVersionInfo = async () => {
      const osVersionInfo = await this.systemApi.getOsVersionInfo()

      return osVersionInfo;
    }

}

export const systemSvc = SystemSvc.instance
