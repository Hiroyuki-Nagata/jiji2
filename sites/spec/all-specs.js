
global._babelPolyfill = false;
import "babel-core/polyfill";

import "./specs/model/preferences-spec";
import "./specs/model/trading/intervals-spec";
import "./specs/model/trading/pairs-spec";
import "./specs/model/trading/rates-spec";
import "./specs/remoting/transformer-spec";
import "./specs/remoting/url-resolver-spec";
import "./specs/remoting/xhr-manager-spec";
import "./specs/utils/dates-spec";
import "./specs/utils/observable-spec";
import "./specs/utils/objects-spec";
import "./specs/viewmodel/chart/slider-spec";
import "./specs/viewmodel/chart/positions-spec";
import "./specs/viewmodel/chart/candle-sticks-spec";
import "./specs/viewmodel/utils/date-formatter-spec";
import "./specs/viewmodel/utils/string-formatter-spec";
import "./specs/viewmodel/utils/number-formatter-spec";
import "./specs/utils/number-utils-spec";
