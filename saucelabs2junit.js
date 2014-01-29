var _ = require('underscore');

module.exports = function jsonfile2junitreport(saucelabsReportFilename, junitFilename){

    var xml = '';

    function aggregate(suite, spec, name){

        if ( ! suite.totalCount ) suite.totalCount = 0;
        if ( ! suite.passedCount ) suite.passedCount = 0;
        if ( ! suite.failedCount ) suite.failedCount = 0;
        if ( ! suite.durationSec ) suite.durationSec = 0;

        suite.totalCount += spec.totalCount;
        suite.passedCount += spec.passedCount;
        suite.failedCount += spec.failedCount;
        suite.durationSec += spec.durationSec;

        /*if ( name ) {
            spec.description = name + ' :: ' + spec.description;
        }*/
    } 

    function processSuites( suite, name ){

       // _.each( results.suites, function(suite){

            var suitename = name;

            if ( suite.description ) {
                var suitename = (name)? name + ' :: '  + suite.description : suite.description;
            }

            if ( suite.specs ) {
                _.each( suite.specs, function(spec){ aggregate(suite, spec) });
            }

            if ( suite.suites ){

                _.each( suite.suites, function(spec){ 
                    processSuites( spec, suitename );
                    aggregate(suite, spec);
                    suite.description = suitename;
                });

            }

        //});

    }

    require('fs').readFile(saucelabsReportFilename, function(err, contentStr){
        var content = JSON.parse(contentStr);
        var platform = content.platform.join(' ');

        processSuites( content.result, platform );
        var r = content.result;

        xml = '<testsuites failures="' + r.failedCount + '" name="' + platform + '" tests="'+ r.totalCount +'" time="'+ r.durationSec +'">';

        function processTest(suite){
        
	    if ( suite.specs ){

              xml += '<testsuite failures="'+suite.failedCount+'" name="'+suite.description+'" tests="'+suite.totalCount+'" time="'+suite.durationSec+'">';

              _.each( suite.specs, function(spec){
		xml += '<testcase assertions="'+spec.totalCount+'" name="'+spec.description+'" time="'+spec.durationSec+'">';

                _.each( spec.failures, function(fail){
			xml += '<failure message="'+fail.message+'" type="'+fail.type+'"/>';
		});

                xml += '</testcase>'; 

              });

              xml += '</testsuite>';
            }
            _.each( suite.suites, function(spec){
                processTest(spec);
            });
        }
            
        processTest(content.result);

        xml += '</testsuites>'

	require('fs').writeFile(junitFilename, xml);

    });

};
