import AbstractService from "./abstract-service"

export default class RmtService extends AbstractService {

  getAccount() {
    return this.xhrManager.xhr(this.serviceUrl( "account" ), "GET");
  }

  getAgentSetting() {
    return this.xhrManager.xhr(this.serviceUrl( "agents" ), "GET");
  }
  putAgentSetting(settings) {
    this.googleAnalytics.sendEvent( "put rmt agent setting" );
    return this.xhrManager.xhr(
      this.serviceUrl("agents"), "PUT", settings);
  }

  endpoint() {
    return "rmt";
  }
}
