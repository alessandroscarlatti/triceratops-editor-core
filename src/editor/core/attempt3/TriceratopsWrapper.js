/**
 * This instance will be responsible for wrapping all calls
 * to the TriceratopsCore.
 *
 * It will accomplish this via a filter chain.
 */
class TriceratopsWrapper {

    constructor(trcCore, filterChainFactory) {
        this._trcCore = trcCore;
        this._filterChainFactory = filterChainFactory;
    }

    /**
     * @param request the request received
     * @return {Object} the response from the message
     */
    acceptMessage(request) {
        let filterChain = this._filterChainFactory.constructFilterForMessage(message);
        let response = {};
        filterChain.doFilter(message, response);
        return response;
    }
}

exports.default = TriceratopsWrapper;

// notes
// filter chain
// can be implemented statefully
// this is probably best done
// if we generate a new filter chain
// for each request...
// class FilterChain {
//     private List<Filter> filters;
//
//     // must cause the "next" filter to be invoked.
//     // if this filter chain is stateful...
//     // we can just pass on the same object to the next filter.
//     public Object doFilter() {
//
//     }
// }
//
// // filter interface
// interface Filter {
//     Object doFilter(request, filterChain);
// }