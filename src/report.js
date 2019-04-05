var jp = require('jsonpath');
global.$ = require("jquery");
global.ix = require("../kolola-intx/intxclient");

/**
 * Render the contents of url (which must contain KOLOLA interchange data)
 * $master must be a jQuery element, acting as a template for each row in the report
 * cols defines a mapping between elements in the master, and jsonpaths to values in each record
 * $output is an element to which each rendered row will be appended
 * type is the type URI of the records that will be rendered (defaults to events)
 */
function KololaReport(opts)
{
    var self = this;

    // Check mandatory options, fill in optional ones
    fillOpts(opts, [
        '$master', 'url', '$output', 'cols'
    ], {
        type: ix.TYPE.event
    });

    // Then unpack options
    $master = opts.$master;
    url = opts.url;
    $output = opts.$output;
    cols = opts.cols;
    type = opts.type;

    var kc = new ix.IntxClient();

    /**
     * Render a single record
     */
    function render(record) {

        // Clone the master element
        var el = $master.clone();
        el.attr('id', false); // Remove the ID!

        // Helper function to get value from an interchange field object
        function val(item) {

            if(Array.isArray(item))
                return val(item[0]);

            if(typeof item !== 'object')
                return item;

            if(item.type == "data")
                return item.value;

            if(item.type == 'pointer')
                return "[POINTER: " + item.uri + "]";
        }


        // For each defined element->field, find the value and update the template
        for(var jqp in cols) {
            var dest = el.find(jqp);
            var srcpath = cols[jqp];

            var value = val(jp.query(record, srcpath));
            dest.text(value);
        }

        // Return the element
        return el;
    }

    // Create a
    var def = $.Deferred();

    /**
     * Fetch the URL and render the events it contains
      */
    kc.fetch(url, function(records){

        console.log(records);

        for(var i in records) {
            var r = records[i];
            if(r['@type'] == type) {
                var e = render(r);
                $output.append(e);
            }
        }

        def.resolve();
    });

    /**
     * Provide a promise object that resolves once rendering is complete, so actions can
     * be taken on completion
     */
    self.complete = function(){
        return def.promise();
    }

}

/**
 * Helper function; check that opts contains all of the properties listed in
 * reqOpts (an array), and copy any properties from defOpts (an object) that
 * don't exist in opts.
 *
 * This in effect requires the keys listed in reqOpts, and takes default options
 * from defOpts.
 */
function fillOpts(opts, reqOpts, defOpts) {
    reqOpts.map(function(k) {
        if(typeof opts[k] == 'undefined')
            throw "Required option '"+k+"' is not set";
    });

    Object.keys(defOpts).map(function(k) {
        if(typeof opts[k] == 'undefined')
            opts[k] = defOpts[k];
    });
}

global.KololaReport = KololaReport;
