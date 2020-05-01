<?php
    $tDate = date("Y/m/d");
    $nDate = date('Y/m/d', strtotime(' +1 day'));
    $fDate = date('Y/m/d', strtotime(' +4 day'));
    //$xml = file_get_contents("http://192.168.99.128:9080/crawl.json?spider_name=eclass&url=http://eclass.puikiucollege.edu.hk/login.php");
    include 'dbh.php';
    $sql = 'SELECT * FROM 9b WHERE end = "'.$tDate.'"';
    $d = $conn->query($sql);
    $sql = 'SELECT * FROM 9b WHERE end BETWEEN "'.$nDate.'" AND "'.$fDate.'" ORDER BY end';
    $fd = $conn->query($sql);

?>


<html>
    <head>
        <meta charset="utf-8"> 
        <!-- Process bar -->
        <!--<link rel="stylesheet" href="flipclock.css">-->
        <script src="progressbar.min.js"></script>
        <link href="https://fonts.googleapis.com/css?family=Raleway:400,300,600,800,900" rel="stylesheet" type="text/css">
        <!-- Filp clock -->
        <!--<link type="text/css" rel="stylesheet" href="clock_assets/flipclock.css" />-->
        <script type="text/javascript" src="../jquery-3.3.1.min.js"></script>
		<!--<script type="text/javascript" src="clock_assets/flipclock.js"></script>-->
        <!-- Material CSS -->
        <link type="text/css" rel="stylesheet" href="../materialize.min.css">
        <link type="text/css" rel="stylesheet" href="../materialize.min.js">
        <!-- 7 Segment Dispaly -->
        <script type="text/javascript" src="SegmentDisplay/excanvas.js"></script>
        <script type="text/javascript" src="SegmentDisplay/segment-display.js"></script>
        <!-- Socket IO-->
        <script src="socketio.js"></script>


    </head>

    <style>

        .top {
            overflow: hidden;
            top: 0;
            width: 100%;
            height: 15%;
            box-shadow: 0 19px 38px rgba(0,0,0,0.30), 0 15px 12px rgba(0,0,0,0.22);
            background-color: rgb(255, 123, 0);
        }
        
        .top-temp {
            top: 23%;
            margin-left: 3%;
            width: 15vw;
            height: 5.5vw;
            display: block;
            float: left;
            position: relative;
            /*border-width: 1px;*/
            /*border-style: solid;*/
            font-size: 350%;
            color: white;
            font-weight: bold;
        }

        .top-warning {
            top: 23%;
            width: 5.5vw;
            height: 5.5vw;
            display: block;
            float: left;
            position: relative;
            /*border-width: 1px;*/
            /*border-style: solid;*/
        }
        
        .top-clock-wrap{
            top: 23%;
            height: 5.5vw;
            min-width: 2%;
            float: right;
            margin-right: 1vw;
            display: block;
            right: 0;
            position: relative;
            /*border-width: 1px;*/
            /*border-style: solid;*/
        }

        .content-wrap {
            margin: auto;
            width: 95%;
            /*border-width: 1px;*/
            /*border-style: solid;*/
            position: relative;
            top: 5vh;
            height: 70vh;
            display: flex
        }

        .countdown {
            margin: auto;
            width: 40%;
            /*border-width: 1px;*/
            /*border-style: solid;*/
            display: none;
        }

        .centre-time {
            margin: auto;
            /*border-width: 1px;*/
            /*border-style: solid;*/
            font-size: 1000%;
            display: none;
        }

        .homework_1d{
            margin: auto;
            /*border-width: 1px;*/
            /*border-style: solid;*/
            width: 100%;
            display: none;
        }

        .homework_4d{
            margin: auto;
            /*border-width: 1px;*/
            /*border-style: solid;*/
            width: 100%;
            display: none;
        }
        #specialEvent {
            margin: auto;
            /*border-width: 1px;*/
            /*border-style: solid;*/
            width: 100%;
            height: 100%;
            background-color: white;
            display: none;  
            position: fixed
        }
        .bottom {
            position: fixed;
            bottom: 0;
            width: 100%;
            height: 6vh;
            border-width: 1px;
            border-style: solid;
            overflow: hidden;
            background: white
        }
    </style>

    <body onload="startTime()">

        <div class="top">
            <div class="top-temp" id="temp">
                
            </div>
            <div class="top-warning" id="warning0">
                
            </div>
            <div class="top-warning" id="warning1">
                
            </div>
            <div class="top-warning" id="warning2">
                
            </div>
            <div class="top-warning" id="warning3">
                
            </div>
            <div class="top-warning" id="warning4">
                
            </div>
            <div class="top-clock-wrap">
                <div class="top-clock" id="top-clock" style="font-size: 350%; color: white;font-weight: bold; letter-spacing: 1vw"></div>
            </div>
        </div>
        
        <div class="content-wrap">

            <div class="countdown" id="container"></div>

            <div class="centre-time" id="timer"></div>

            <div class="homework_1d" id="homework_1d">
                <table style="font-size: xx-large">
                    <thead>
                        <tr>
                            <th>學科</th><th>標題</th><th>是否需要提交</th>
                        </tr>
                    </thead>
                    <tbody id="todayhw">
                        <?php
                            //if ($d->num_rows > 0) {
                            //    while($row = $d->fetch_assoc()) {
                            //    echo '<tr><td>'.$row["subject"].'</td><td>'.$row["title"].'</td></tr>';
                            //    }
                            //} else {
                            //echo "0 results";
                            //}
                        ?>
                    </tbody>
                </table>
            </div>

            <div class="homework_4d" id="homework_4d">
                <p style="color: lightgray; font-size: large; margin: 0px;" id="update"></p>
                <table style="font-size: 150%">
                    <thead>
                        <tr>
                            <th>學科</th><th>標題</th><th>提交日期</th><th>是否需要提交</th>
                        </tr>
                    </thead>
                    <tbody id="futurehw">
                        <?php
                            //if ($fd->num_rows > 0) {
                            //    while($row = $fd->fetch_assoc()) {
                            //    echo '<tr><td>'.$row["subject"].'</td><td>'.$row["title"].'</td><td>'.$row["end"].'</td><td>'.$row["submit"].'</td></tr>';
                            //    }
                            //} else {
                            //echo "0 results";
                            //}
                        ?>
                    </tbody>
                </table>
            </div>
            <div id="specialEvent">
                <p id="specialEventText" class="center-align" style="font-size: 10vh; margin: 10%"></p>
            </div>
        </div>
        
        <div class="bottom">
            <marquee behavior="scroll" direction="left">
                <pre style="margin:0px; font-size: x-large; font-family: sans-serif;" id="marquee">TSIDS</pre>
            </marquee>
        </div>

    </body>

	<script type="text/javascript">

    // Top right flip clock 
	$(function(){
		FlipClock.Lang.Custom = { days:'Days', hours:'Hours', minutes:'Minutes', seconds:'Seconds' };
		var opts = {
			clockFace: 'TwentyFourHourClock',
			countdown: true,
			language: 'Custom'
		};
		opts.classes = {
			active: 'flip-clock-active',
			before: 'flip-clock-before',
			divider: 'flip-clock-divider',
			dot: 'flip-clock-dot',
			label: 'flip-clock-label',
			flip: 'flip',
			play: 'play',
			wrapper: 'flip-clock-small-wrapper'
		}; 
		$('.top-clock').FlipClock(opts);
	});

    // Countdown clock
    var bar = new ProgressBar.Circle('#container', {
        color: '#aaa',
        strokeWidth: 5,
        trailWidth: 1,
        easing: 'linear',
        duration: 6000,
        text: {
            autoStyleContainer: true
        },
        from: { color: '#58FA58', width: 1 },
        to: { color: '#FA5858', width: 5 },
        step: function(state, circle) {
            circle.path.setAttribute('stroke', state.color);
            circle.path.setAttribute('stroke-width', state.width);
            circle.path.style.strokeLinecap = 'round';
            var value = Math.ceil(circle.value() * 60);
                if (value === 0) {
                circle.setText('');
                } else {
                circle.setText(value*-1+61);
                }
            }
        });
        bar.text.style.fontFamily = 'sans-serif, "Raleway", Helvetica';
        bar.text.style.fontSize = '20vh';

    // Centre clock
    function startTime() {
        var today = new Date();
        var h = today.getHours();
        var m = today.getMinutes();
        var s = today.getSeconds();
        m = checkTime(m);
        s = checkTime(s);
        document.getElementById('top-clock').innerHTML = h + ":" + m + ":" + s;
        var t = setTimeout(startTime, 500);
    }
    function checkTime(i) {
        if (i < 10) {i = "0" + i};  // add zero in front of numbers < 10
        return i;
    }

    // Connect to Socket.io
    var socket = io('http://6p4ever.website:3000');
    socket.emit('client', "connected");
    socket.on('number', function (data) {
        //document.getElementById("text").innerHTML = data;
    });
    socket.on('todayHW', function (data) {
        showTodayTable(data)
    });
    socket.on('futureHW', function (data) {
        showFutureTable(data)
    });

    // Database to table
    function showTodayTable(raw) {
        let subject = raw.subject;
        let title = raw.title;
        let submit = raw.submit;
        let i = 0;
        let table = "";
        while (i < subject.length) {
            table += '<tr><td>'+subject[i]+'</td><td>'+title[i]+'</td><td>'+submit[i]+'</td></tr>';
            i++
        }
        document.getElementById("todayhw").innerHTML = table;
    }

    function showFutureTable(raw) {
        let subject = raw.subject;
        let title = raw.title;
        let end = raw.end;
        let submit = raw.submit;
        let i = 0;
        let table = "";
        while (i < title.length) {
            table += '<tr><td>'+subject[i]+'</td><td>'+title[i]+'</td><td>'+end[i]+'</td><td>'+submit[i]+'</td></tr>';
            i++
        }
        document.getElementById("futurehw").innerHTML = table;
    }

    // Future homework last update time
    socket.on('update', function (data) {
        document.getElementById("update").innerHTML = data;
    });

    // Temerpature
    socket.on('temperature', function (data) {
        document.getElementById("temp").innerHTML = data;
    });

    // Weather warning
    socket.on('warning', function (data) {
        // Reset warning images
        document.getElementById("warning0").innerHTML = "<img src=''>";
        document.getElementById("warning1").innerHTML = "<img src=''>";
        document.getElementById("warning2").innerHTML = "<img src=''>";
        document.getElementById("warning3").innerHTML = "<img src=''>";
        document.getElementById("warning4").innerHTML = "<img src=''>";
        let warning = data;
        for (i = 0; i < warning.length; i++) {
            switch (warning[i]) {
                case "寒冷天氣警告":
                    document.getElementById("warning" + i).innerHTML = "<img src='warning/cold.gif' style='border-radius: 5%;width: 100%'>";
                    break;

                case "紅色火災危險警告":
                    document.getElementById("warning" + i).innerHTML = "<img src='warning/firer.gif' style='border-radius: 5%;width: 100%'>";
                    break;

                case "黃色火災危險警告":
                    document.getElementById("warning" + i).innerHTML = "<img src='warning/firey.gif' style='border-radius: 5%;width: 100%'>";
                    break;

                case "霜凍警告":
                    document.getElementById("warning" + i).innerHTML = "<img src='warning/frost.gif' style='border-radius: 5%;width: 100%'>";
                    break;

                case "山泥傾瀉警告":
                    document.getElementById("warning" + i).innerHTML = "<img src='warning/landslip.gif' style='border-radius: 5%;width: 100%'>";
                    break;

                case "新界北部水浸特別報告":
                    document.getElementById("warning" + i).innerHTML = "<img src='warning/ntfl.gif' style='border-radius: 5%;width: 100%'>";
                    break;

                case "黃色暴雨警告信號":
                    document.getElementById("warning" + i).innerHTML = "<img src='warning/raina.gif' style='border-radius: 5%;width: 100%'>";
                    break;

                case "黑色暴雨警告信號":
                    document.getElementById("warning" + i).innerHTML = "<img src='warning/rainb.gif' style='border-radius: 5%;width: 100%'>";
                    break;

                case "紅色暴雨警告信號":
                    document.getElementById("warning" + i).innerHTML = "<img src='warning/rainr.gif' style='border-radius: 5%;width: 100%'>";
                    break;

                case "強烈季候風信號":
                    document.getElementById("warning" + i).innerHTML = "<img src='warning/sms.gif' style='border-radius: 5%;width: 100%'>";
                    break;

                case "一號戒備信號":
                    document.getElementById("warning" + i).innerHTML = "<img src='warning/tc1.gif' style='border-radius: 5%;width: 100%'>";
                    break;

                case "三號強風信號":
                    document.getElementById("warning" + i).innerHTML = "<img src='warning/tc3.gif' style='border-radius: 5%;width: 100%'>";
                    break;

                case "八號東北烈風或暴風信號":
                    document.getElementById("warning" + i).innerHTML = "<img src='warning/tc8ne.gif' style='border-radius: 5%;width: 100%'>";
                    break;

                case "八號西北烈風或暴風信號":
                    document.getElementById("warning" + i).innerHTML = "<img src='warning/tc8nw.gif' style='border-radius: 5%;width: 100%'>";
                    break;

                case "八號東南烈風或暴風信號":
                    document.getElementById("warning" + i).innerHTML = "<img src='warning/tc8se.gif' style='border-radius: 5%;width: 100%'>";
                    break;

                case "八號西南烈風或暴風信號":
                    document.getElementById("warning" + i).innerHTML = "<img src='warning/tc8sw.gif' style='border-radius: 5%;width: 100%'>";
                    break;

                case "九號烈風或暴風風力增強信號":
                    document.getElementById("warning" + i).innerHTML = "<img src='warning/tc9.gif' style='border-radius: 5%;width: 100%'>";
                    break;

                case "十號颶風信號":
                    document.getElementById("warning" + i).innerHTML = "<img src='warning/tc10.gif' style='border-radius: 5%;width: 100%'>";
                    break;

                case "雷暴警告":
                    document.getElementById("warning" + i).innerHTML = "<img src='warning/ts.gif' style='border-radius: 5%;width: 100%'>";
                    break;

                case "海嘯警告":
                    document.getElementById("warning" + i).innerHTML = "<img src='warning/tsunami-warn.gif' style='border-radius: 5%;width: 100%'>";
                    break;

                case "酷熱天氣警告":
                    document.getElementById("warning" + i).innerHTML = "<img src='warning/vhot.gif' style='border-radius: 5%;width: 100%'>";
                    break;
            }
        }
    });

    function testCountdown() {
        document.getElementById("homework_1d").style.display = "none";
        document.getElementById("container").style.display = "block";
        document.getElementById("homework_4d").style.display = "none";
        bar.animate(1.0);
    }

    function beforeSchool() {
        document.getElementById("homework_1d").style.display = "block";
        document.getElementById("container").style.display = "none";
        document.getElementById("homework_4d").style.display = "none";
    }

    function class_40() {
        document.getElementById("homework_1d").style.display = "none";
        document.getElementById("container").style.display = "block";
        document.getElementById("homework_4d").style.display = "none";
        bar.set(0);
        bar.animate(1.0, {
            duration: 2400000,
            from: { color: '#58FA58', width: 1 },
            to: { color: '#FA5858', width: 5 },
            step: function(state, circle) {
                circle.path.setAttribute('stroke', state.color);
                circle.path.setAttribute('stroke-width', state.width);
                circle.path.style.strokeLinecap = 'round';
                var value = Math.ceil(circle.value() * 40);
                if (value === 0) {
                circle.setText('');
                } else {
                circle.setText(value*-1+41);
                }
            }
        });
    }

    function class_80() {
        document.getElementById("homework_1d").style.display = "none";
        document.getElementById("container").style.display = "block";
        document.getElementById("homework_4d").style.display = "none";
        bar.set(0);
        bar.animate(1.0, {
            duration: 4800000,
            from: { color: '#58FA58', width: 1 },
            to: { color: '#FA5858', width: 5 },
            step: function(state, circle) {
                circle.path.setAttribute('stroke', state.color);
                circle.path.setAttribute('stroke-width', state.width);
                circle.path.style.strokeLinecap = 'round';
                var value = Math.ceil(circle.value() * 80);
                if (value === 0) {
                circle.setText('');
                } else {
                circle.setText(value*-1+81);
                }
            }
        });
    }

    function recess() {
        document.getElementById("homework_1d").style.display = "none";
        document.getElementById("container").style.display = "none";
        document.getElementById("homework_4d").style.display = "block";
    }
    recess();
    
    function specialEvent(text) {
        if (text == "end") {
            document.getElementById("specialEvent").style.display = "none";
        } else {
            document.getElementById("specialEvent").style.display = "block";
            document.getElementById("specialEventText").innerHTML = text
        }
    }
    
    // Recess
    socket.on('time', function (data) {
        if (data == "before_school") {
            beforeSchool()
        } else if (data == "recess") {
            recess()
        } else if (data == "class_80") {
            class_80()
        } else if (data == "class_40") {
            class_40()
        }
    });

    // Special events
    socket.on('specialEventBC', function (data) {
        specialEvent(data);
    }); 
    
    // Update marquee
    socket.on('marquee', function (data) {
        document.getElementById("marquee").innerHTML = data;
    }); 

	</script>

</html>