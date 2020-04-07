export class TripItemInfo {
    public id: number;
    public start_date: string = "";
    public duration: number;
    public enforced: boolean = false;

    private dateOptions = {weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'};
  
    constructor() {}
  
    addStartDate(start_date) {
      var datems = Date.parse(start_date);
      this.start_date = new Date(datems).toLocaleString([], this.dateOptions);
    }
  
    addDuration(duration) {
      this.duration = duration;
    }
  
    addEnforced(enforced) {
      this.enforced = enforced;
    }
  
}
  