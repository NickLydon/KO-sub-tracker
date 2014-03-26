KO-sub-tracker
==============

<h3>A client-server package that tracks the frequency in which knockout observables notify subscribers</h3>

This tool was developed from a need to analyse the performance of my web app.  
The client-side script subscribes to the view model's observables and reports to the server. The server shows the results in a pretty chart! 
Check out <a href="https://github.com/NickLydon/KO-sub-tracker/blob/master/test/integration.html">test/integration.html</a> and <a href="https://github.com/NickLydon/KO-sub-tracker/blob/master/test/integration.js">test/integration.js</a> for examples of how to set it up on the client. 
To set up the server just call <pre>C:\Github\KO-sub-tracker\server> node server.js</pre>, or if you want to specify a particular port, e.g. 4000 then: <pre>C:\Github\KO-sub-tracker\server> node server.js 4000</pre>. When it's listening, just browse to <pre>http://localhost:4000</pre> This will give you a list of links that take you to the captured sessions. 
