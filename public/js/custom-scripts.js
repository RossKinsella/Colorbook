
$(document).ready(function() {
    // Globals
    States = {pageIsActive: true, tappedInfoButton: false };
    InteractionIndex = {datetime: 0, user_id: 1, color: 2};
    ClockElements = { year: $('#year'), month: $('#month'), day: $('#day'), hour: $('#hour'), minute: $('#minute')};
    Variables = { interactionFrequency: 15, minInteractionSize: 10, maxInteractionSize: 30 }
    Interactions = new Queue();
    
    // Events
    $('.info').on('tap', function(){ 
        // console.log(States.tappedInfoButton);
        if (States.tappedInfoButton)
        {
            $('#more-info').stop( true, true ).fadeOut( 400 ); 
            $('.info').removeClass('show');
            // console.log($('.info').attr("class").split(' '));
            States.tappedInfoButton  = false;
        }
        else{
            $('#more-info').stop( true, true ).fadeIn( "slow" ); 
            $('.info').addClass('show');
            // console.log($('.info').attr("class").split(' '));
            States.tappedInfoButton  = true;            
        }
    });

    injectInteractionAnimationRule();
    Initialise();


    function Initialise()
    {
        // Pause state event listeners
        $(window).blur(function(){
            States.pageIsActive = false;
        });

        $(window).focus(function(event) {
           States.pageIsActive = true;
        });

        // Parse the data.
        Papa.parse("data/message_data.csv", {
            download: true,
            complete: function(results) {
                // Add every interaction to a Queue
                for (var i= 1; i < results.data.length - 1; i++)
                {
                        QueueInteraction((results.data[i]));     
                }
                // Start the main logic.
                $('#loader-container').fadeOut( "slow" );
                $('#clock').fadeIn( "slow" );
                $('.info').fadeIn( "slow" );
                
                StartMusic();
                
                
                Main();
            }
        }); 
    }

    function Main()
    {
        // Infinite loop
        window.setInterval(function () {
            if (States.pageIsActive && !Interactions.isEmpty())
            {
                // Dequeue an interaction and activate it
                var interaction = Interactions.dequeue();
                ActivateInteraction(interaction);
            }
            else
            {
                // console.log('Paused');
            }
        }, Variables.interactionFrequency); // repeat forever, polling every 0.1 seconds
    }

    function ActivateInteraction(interaction)
    {
        // Update the time
        datetime = interaction.datetime;
        UpdateTimer(datetime);

        // Get animation properties
        var color = "background:" + interaction.color + ";";
        var sizeInt = getRandomInt(Variables.minInteractionSize, Variables.maxInteractionSize);
        var size = "height: " + sizeInt + "px; width: " + sizeInt + "px;";
        var topOffset = "top: " + getRandomInt(0,100) + "%;"; 
        var style = topOffset+color+size;

        // Create the animation with a self destruct
        $("<div class='interaction-ball' style='" + style + "'></div>").appendTo('#interaction-container').one("webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend", function(){$(this).remove();});
    }

    function UpdateTimer(datetime)
    {
        ClockElements.year.text(datetime.substr(0, 4));
        ClockElements.month.text(datetime.substr(5, 2));
        ClockElements.day.text(datetime.substr(8, 2));
        ClockElements.hour.text(datetime.substr(11, 2));
        ClockElements.minute.text(datetime.substr(14, 2));        
    }

    function Interaction(radius, speed, width, xPos, yPos, datetime, user_id, color) {
        this.radius = radius;
        this.speed = speed;
        this.width = width;
        this.xPos = xPos;
        this.yPos = yPos;
        this.datetime = datetime;
        this.user_id = user_id;
        this.color = color;
        this.opacity = .05 + Math.random() * .5;
    }

    function QueueInteraction(interaction_data) {

        var randomX = 0;
        var randomY = 0;
        var speed = 7;
        var size = 5 + Math.random() * 100;

        var interaction = new Interaction(
            10,
            speed,
            size,
            randomX,
            randomY,
            interaction_data[InteractionIndex.datetime],
            interaction_data[InteractionIndex.user_id],
            interaction_data[InteractionIndex.color]
        );
        
        Interactions.enqueue(interaction);
    }  

    function getRandomInt(min, max) {
     return Math.round(Math.random() * (max - min + 1)) + min;
    }  

    // I cant figure out how to dynamically set my transitions so this exists
    function injectInteractionAnimationRule() {
        var prefix = getVendorPrefix();
        var screenWidth = $( window ).width() * window.devicePixelRatio; 
        var styleSheet = document.styleSheets[0];
        var name = 'implode'; // An animation has no selector but it does have a name...

        var ruleOutterTop = '@' + prefix + '-keyframes implode {'
        var ruleBody = '100% { ' + prefix + '-transform: translateX(' + screenWidth + 'px); transform: translateX(' + screenWidth +  'px); }'
        var ruleOutterBot = '}'

        var rule = ruleOutterTop + ruleBody + ruleOutterBot;

        

        var index = 0;
        if (styleSheet.rules) // chrome and safari
        {
            index = styleSheet.rules.length;
            styleSheet.insertRule(rule , index);
        }
        else if (styleSheet.cssRules) // firefox and IE
        {
            index = styleSheet.cssRules.length;
            styleSheet.insertRule(rule , index);
        }
        else 
            alert('Something has gone wrong. \n\nI would really appreciate it if you emailed at ross.kinsella.ie@gmail.com \n\nWith your:\n - Browser and its version \n - The app you were looking at');
    }

    function getVendorPrefix () {
        var ua = navigator.userAgent.toLowerCase(),
            match = /opera/.exec(ua) || /msie/.exec(ua) || /firefox/.exec(ua) || /(chrome|safari)/.exec(ua),
            vendors = {
                opera: '-O',
                chrome: '-webkit',
                safari: '-webkit',
                firefox: '-Moz',
                msie: '-ms'
            };
        
        return vendors[match[0]];
    }

    // You cannot autoplay media for IOS.
    function StartMusic()
    {
        var iOS = ( navigator.userAgent.match(/(iPad|iPhone|iPod)/g) ? true : false );
        if (iOS)
            $('#jack-credit').remove();
        else
            $('#loader-container').append("<iframe style='display:none;' width= '100%' height= '450' scrolling= no' frameborder= 'no' src= 'https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/196109539&amp;auto_play=true&amp;hide_related=false&amp;show_comments=true&amp;show_user=true&amp;show_reposts=false&amp;visual=true'></iframe>");
    }

});