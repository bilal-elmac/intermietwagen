import { HistoryService } from '../../services/UrlServices';

import { Throttler } from '../../utils/ThrottleUtils';

export class BrowserHistoryService implements HistoryService {
    private throttler = new Throttler(500);

    getUrlParameters(): [string, string, string] {
        return [window.location.href, window.location.pathname, window.location.search];
    }

    push(...[pathname, parameters]: [string, string]): void {
        this.throttler.run(() => {
            const [wPathname, wSearch] = this.getUrlParameters();

            if (wPathname === pathname && wSearch === parameters) {
                return;
            }

            history.pushState({ wPathname, wSearch }, window.document.title, `${pathname}?${parameters}`);
        });
    }
}
