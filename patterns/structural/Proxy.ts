/*
Proxy = provide a substitute for another object, controlling access to the original one. ("should the real object receive this request?")

# Problem
- You have a huge object that consumes a lot of resources, and you don't need it in every object.
- We can't place it inside every object that requires it.
- Or you simply need to control access to the original object.

# Solution
- Create a proxy object with the same interface as the original object
- The client only calls the proxy that decides if the real object should receive the request or not (controlling access to the original object).
--> service interface = the interface of the service.
--> concrete service = contains behaviors and the required methods.
--> proxy = implements the service interface so it can disguise itself as a service object and controls access to the real service.
--> client = communicates only with the proxy.
*/

// service interface
interface ReportService {
  getReport(id: string, role: string): string;
}

// concrete service: expensive to build
class RealReportService implements ReportService {
  constructor() {
    console.log('Loading heavy report engine');
  }
  getReport(id: string): string {
    console.log(`Building report ${id}`);
    return `report-${id}`;
  }
}

// proxy: role check -> cache -> lazy init of the real service
class ReportProxy implements ReportService {
  private service?: RealReportService;
  private cache = new Map<string, string>();

  getReport(id: string, role: string): string {
    if (role !== 'admin') throw new Error('Forbidden'); // role based access
    if (this.cache.has(id)) return this.cache.get(id)!; // cache

    if (!this.service) this.service = new RealReportService(); // lazy init
    const report = this.service.getReport(id);
    this.cache.set(id, report);
    return report;
  }
}

// client: talks only to the proxy
const reports: ReportService = new ReportProxy(); // nothing loaded yet
reports.getReport('42', 'admin'); // loading heavy report engine -> building report 42
reports.getReport('42', 'admin'); // cached, no build

try {
  reports.getReport('99', 'guest'); // throws forbidden (role based access)
} catch (error) {
  console.log('error', error)
}

