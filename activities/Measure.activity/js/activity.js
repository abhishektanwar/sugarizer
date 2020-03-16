define(["sugar-web/activity/activity",], function (activity) {

	// Manipulate the DOM only when it is ready.
	requirejs(['domReady!'], function (doc) {

		// Initialize the activity.
		activity.setup();





	// document.getElementById("graph").addEventListener("click",function(event){
	// 	if(document.getElementById("graph").value == 0){
	// 	var t = function(p){
	// 		p.mic2;
	// 		p.yslider;
	// 		p.xslider;
	// 		p.setup = function(){
	// 		p.createCanvas(800,500);
	// 		p.mic2 = new p5.AudioIn();
	// 		p.mic2.start();
	// 		p.fft = new p5.FFT();
	// 		p.fft.setInput(p.mic2);
	// 		let d = p.createDiv();
	// 		d.style('margin-left:6%;');
	// 		d.style('padding-left: 50px;');
	// 		d.style('transform-origin: 0 50% 0');
	// 		d.style('transform: rotate(' + ((360 / 4)) + 'deg);');
	// 		d.position(820, 200);
	// 		p.yslider=p.createSlider(0.2,2,0.5,0.05);
	// 		d.child(p.yslider);
	// 		p.xslider= p.createSlider(1,2,0.5,0.05);
	// 		d.child(p.xslider)
	// 		// console.log(p.yslider.value());
	// 		// sound.amp(0.2);
	// 		};
	// 		p.draw = function(){
	// 		p.background(220);
		
	// 		let spectrum = p.fft.analyze();
	// 		p.noStroke();
	// 		p.fill(255, 0, 255);
	// 		for (let i = 0; i< spectrum.length; i++){
	// 			let x = p.map(i*p.xslider.value(), 0, spectrum.length, 0, p.width);
	// 			let h = -p.height + p.map(spectrum[i]*p.yslider.value(), 0, 255, p.height, 0);
	// 			p.rect(x, p.height, p.width / spectrum.length, h )
	// 		}
	// 		};
			
	// 	};
	// 	// document.getElementById("two").style.display="block";
	// 	var myp5 = new p5(t,'two');
		
	// 	// document.getElementById("one").style.display="none";
	// 	// console.log("hello");
	// 	// document.getElementById("graph2").style.display="none";
	// 	document.getElementById("graph").value =1;
	// 	document.getElementById("graph").innerHTML="STOP";
	// 	}
	// 	else{
	// 	var s = function(p){
	// 			p.mic1;
	// 			p.yslider;
	// 			p.xslider;
	// 			p.button;
	// 			p.setup = function(){
					
	// 				p.createCanvas(800,500);
	// 				console.log("in1");
	// 				p.mic1 = new p5.AudioIn();
	// 				console.log("in");
	// 				p.mic1.start();
	// 				p.fft = new p5.FFT();
	// 				p.fft.setInput(p.mic1);
	// 				p.yslider=p.createSlider(0,5,0.5,0.05);
	// 				p.xslider=p.createSlider(1,5,0.5,0.05);
	// 				// console.log(p.yslider.value());
	// 				p.button=p.createButton('');
	// 			// sound.amp(0.2);
	// 			};
	// 			p.draw = function(){
	// 				p.background(220);
	// 				let waveform = p.fft.waveform();
	// 				p.noFill();
	// 				// p.fill(0,0,255)
	// 				// console.log(waveform);
	// 				p.beginShape();
	// 				p.stroke(0);
	// 				p.button.innerHtml=p.yslider.value();
	// 				for (let i = 0; i < waveform.length; i++){
	// 				let x = p.map(i*p.xslider.value(), 0, waveform.length, 0, p.width);
	// 				let y = p.map( waveform[i]*p.yslider.value(), -1, 1, 0, p.height);
	// 				p.vertex(x,y);
		
	// 				p.endShape();
					
	// 			};

	// 			};
				
	// 			var myp5 = new p5(s,'one');
	// 			document.getElementById("graph").style.display="none";
	// 	}
	// }
	// });
  
	});

});
