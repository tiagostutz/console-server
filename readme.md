# What it does
Replaces your console object with a more stylish and practical way of displaying notices,warn,info,debug,log and errors.
It automagically shows you the line number and filename where the command was executed, along with a timestamp.



# How does it look

![Example1](http://s15.postimg.org/cvkyicxzf/output.png)

![Example2](http://s29.postimg.org/co4sovpk7/uncaught.png)





# How do I use it

1. Start by installing the package:
    npm install console-debug


2. Put this in your nodejs server file

    var Debug = require('./debug');

	var console = new Debug({uncaughtExceptionCatch: true}); 




	
3. Now you can do stuff like:

    console.log("I am a log!");

    console.warn("I am a warn!");

    console.error("I am a error!");

    console.debug("I am a debug!");

    console.info("I am a info!");
	
	

# Contact
You can contact me at specamps@gmail.com

	
