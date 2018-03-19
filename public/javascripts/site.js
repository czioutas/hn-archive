var search = algoliasearch('SJRRO4N629', '5b5c4cb39126213a9f2f0b2cd6c1b115');
var submissionIndex = search.initIndex('hn');

var data = null;

var xhr = new XMLHttpRequest();
xhr.withCredentials = true;

xhr.addEventListener("readystatechange", function () {
  if (this.readyState === 4) {
    
    content = JSON.parse(this.responseText);
    
    minDateYear = new Date(content.dates[0]*1000).getFullYear();
    maxDateYear = new Date(content.dates[content.dates.length-1]*1000).getFullYear();

    var picker = new Pikaday({
        field: document.getElementById('datepicker'),
        yearRange: [minDateYear, maxDateYear],
        disableDayFn: function (date) {

            date.setHours(1);
            date.setMinutes(0);
            date.setSeconds(0);
            date.setMilliseconds(0);
            
            utc = parseInt(date.getTime() / 1000).toFixed(0);

            if (!content.dates.includes(utc)) {
                return date;
            }
        },
        toString(date, format) {
            var DD = ('0' + date.getDate()).slice(-2);
            var MM = ('0' + (date.getMonth() + 1)).slice(-2);
            var YYYY = date.getFullYear();

            var DDMMYYYY = DD + '-' + MM + '-' + YYYY;

            return DDMMYYYY;
        },
        onSelect: function (date) {
            hide('#noresults');
            hide('#indicator');
            hide('#info');
            show('#searching');            

            date.setHours(1);
            date.setMinutes(0);
            date.setSeconds(0);
            date.setMilliseconds(0);

            utc = parseInt(date.getTime() / 1000).toFixed(0);
            console.log(utc);

            submissionIndex.search(utc, function (err, content) {
                if (content.hits[0] === undefined)
                {                    
                    hide('#searching');
                    show('#noresults');
                }
                document.querySelector('#searching').classList.toggle("hidden");
                
                var i = 1;


                content.hits[0].submissions.forEach(function(sb) {
                    document.getElementById('tableHead').classList.remove("hidden");
                    var baseClone = document.getElementById('placeholderTr').cloneNode(true);

                    var clone = baseClone;
                    clone.querySelector('#rank').innerText = i++;
                    clone.querySelector('#score').innerText = sb.score;
                    clone.querySelector('#title').innerText = sb.title;
                    clone.querySelector('#title').href = clone.querySelector('#title').href + sb.id;
                    if (sb.href != null) {
                        var j = sb.href.lastIndexOf("http");
                        clone.querySelector('#title').href = sb.href.substring(j, sb.length);
                        console.log(sb.href.substring(j, sb.length));
                    }
                    clone.querySelector('#author').innerText = sb.user;
                    clone.querySelector('#author').href = clone.querySelector('#author').href + sb.user;
                    clone.querySelector('#baseurl').innerText = sb.urlBase;
                    clone.querySelector('#comments').innerText = sb.numberOfComments;
                    clone.querySelector('#comments').href = clone.querySelector('#comments').href + sb.id;

                    clone.classList.remove("hidden");
                    clone.style.display = "";

                    document.getElementById('dataBody').appendChild(clone);

                });
            });
        }
    });
  }
});

xhr.open("GET", "http://localhost:3000/dates.json");

xhr.send(data);

document.addEventListener('DOMContentLoaded', function () {

    // Get all "navbar-burger" elements
    var $navbarBurgers = Array.prototype.slice.call(document.querySelectorAll('.navbar-burger'), 0);

    // Check if there are any navbar burgers
    if ($navbarBurgers.length > 0) {

        // Add a click event on each of them
        $navbarBurgers.forEach(function ($el) {
            $el.addEventListener('click', function () {

                // Get the target from the "data-target" attribute
                var target = $el.dataset.target;
                var $target = document.getElementById(target);

                // Toggle the class on both the "navbar-burger" and the "navbar-menu"
                $el.classList.toggle('is-active');
                $target.classList.toggle('is-active');

            });
        });
    }

});

function show(selector) {
    var x = document.querySelector(selector);
    x.style.display = "";
    x.classList.remove("hidden");
}

function hide(selector) {
    var x = document.querySelector(selector);
    x.style.display = "none";
    x.classList.add("hidden");
}

