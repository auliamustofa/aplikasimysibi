var isRecording = false;
var dataGlobal;
var arrayData = [];
var dataFeatures = [];
var strOutput;


var controller = new Leap.Controller({
    host: '127.0.0.1',
    port: 6437,
    enableGestures: false,
    frameEventName: 'deviceFrame',
    useAllPlugins: true
});

controller.connect();
controller.on('deviceAttached', function(){
  var idalat = document.getElementById("idalat"); 
  idalat.innerHTML = "Leap Motion Telah Terkoneksi";
});
displayDataLeap();



function displayDataLeap(){
    var lastValidFrameId;
    var printed;
    var lala = document.getElementById("lala"); 


    Leap.loop({
    // frame callback is run before individual frame components
        frame: function (frame) {
            if(lastValidFrameId!=undefined && printed == false && frame.hands.length == 0){
                printed = true;
            }
            lala.innerHTML = frame.currentFrameRate;
        },

        // hand callbacks are run once for each hand in the frame
        hand: function (hand) {
            dataGlobal = reasemblyData(hand);
            lala.innerHTML += hand.type + ',' + hand.palmPosition + ',' + hand.direction + ',' + hand.palmVelocity + '<br/>';            hand.fingers.forEach(function (finger) {
                lala.innerHTML += finger.type + ',' + finger.dipPosition + ',' + finger.pipPosition + ',' + finger.mcpPosition + ',' + finger.carpPosition + '<br/>'
            })
            
            if(isRecording){
                recordLeap();
            }
        }
        
    })
    

}

const reasemblyData = (hand) =>{
    data = {palm: {type: hand.type, position: hand.palmPosition, direction: hand.palmPosition, velocity: hand.palmVelocity}, finger: ""}
    let dataFinger = []
    let finger = hand.fingers.forEach(function (finger){
        //info.innerHTML +=  finger.type+','+finger.dipPosition+','+finger.pipPosition+','+finger.mcpPosition+','+finger.carpPosition+'<br/>'
        dataFinger.push({type: finger.type, dip: finger.dipPosition, pip: finger.pipPosition, mcp: finger.mcpPosition, carp: finger.carpPosition})
    })
    data.finger = dataFinger
    return data
}


function rekamLeap() {
    isRecording = true;
    console.log(isRecording);
    
    setTimeout(function () {
      isRecording = !isRecording;
      console.log(isRecording);
      predictLeap(sendData);
      console.log(sendData);
      
    //checkAnswer();
    }, 1000);
}
function rekamLeapKuis() {
  isRecording = true;
  console.log(isRecording);
  
  setTimeout(function () {
    isRecording = !isRecording;
    console.log(isRecording);
    predictLeapKuis(sendData);
    console.log(sendData);
    
  //checkAnswer();
  }, 1000);
}
function recordLeap(){
    dataFeatures.push(jsontoarray(dataGlobal));
    // console.log(dataFeatures.length);
    sendData = calculateMean(dataFeatures);

}

const jsontoarray = (jsonfile) => {
    //console.log(jsonfile)
    array = [];
    let palm = jsonfile.palm;
    let finger = jsonfile.finger;

    array = array.concat(palm.position);
    array = array.concat(palm.direction);
    array = array.concat(palm.velocity);
    
    finger.forEach((item)=>{
        array = array.concat(item.dip);
        array = array.concat(item.pip);
        array = array.concat(item.mcp);
        array = array.concat(item.carp);
    });
    return array;
}

const calculateMean = (dataArr) => {
    const dataCount = dataArr.length;
    const dataFeature = dataArr[0].length; 
    let mean = [];
    for(let i=0;i<dataFeature;i++){
        let total = 0;
        for(let index=0;index<dataCount;index++){
            total += dataArr[index][i];
        }
        mean.push(total/dataFeature);
    }
    return mean;
}

const predictLeap = async(data, get=0) => {
    const url = "http://34.101.133.218:8000/leap"
    // const url = "http://localhost:9000/leap"
    const token = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpZCI6MjAsImlkX3VzZXIiOjEsInByb2plY3RfbmFtZSI6ImxlYXAifQ.31Eb0-jL8YgPUyeVtzWTZ6fECYp5nMhtm7Y4PyMBbaw";
    let bodyFormData = new FormData();
    bodyFormData.append('test', data);
    bodyFormData.append('get', get);
    console.log(url);
    axios({
        method: "post",
        url: url,
        data: bodyFormData,
        headers: { "Content-Type": "multipart/form-data", 
          "Authorization": "Bearer " + token
        },
      })
        .then(function (response) {
          // console.log(response.data.values);
          let str = response.data.values;
          //let lili = document.getElementById('lili');
          //lili.innerHTML = str;
          strOutput = str[0][0];
          console.log(str);
          //rekamLeap();
          checkNotif(strOutput,huruf);

        })
        .catch(function (error) {
          console.log(error);
        });
    dataFeatures = [];
}

const predictLeapKuis = async(data, get=0) => {
  const url = "http://34.101.133.218:8000/leap"
  // const url = "http://localhost:9000/leap"
  const token = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpZCI6MjAsImlkX3VzZXIiOjEsInByb2plY3RfbmFtZSI6ImxlYXAifQ.31Eb0-jL8YgPUyeVtzWTZ6fECYp5nMhtm7Y4PyMBbaw";
  let bodyFormData = new FormData();
  bodyFormData.append('test', data);
  bodyFormData.append('get', get);
  console.log(url);
  axios({
      method: "post",
      url: url,
      data: bodyFormData,
      headers: { "Content-Type": "multipart/form-data", 
        "Authorization": "Bearer " + token
      },
    })
      .then(function (response) {
        // console.log(response.data.values);
        let str = response.data.values;
        //let lili = document.getElementById('lili');
        //lili.innerHTML = str;
        strOutput = str[0][0];
        console.log(str);
        //rekamLeap();
        checkNotif(strOutput,stringIMG);

      })
      .catch(function (error) {
        console.log(error);
      });
  dataFeatures = [];
}

function checkNotif(output, button){
  if(output.toLocaleLowerCase()  === button.toLocaleLowerCase() ){
    alertbenar(output);
  }
  else{
    alertsalah(output);
  }

}
function alertbenar(text){
  let timerInterval;
    Swal.fire({
      title: 'Terdeteksi : '+text+' Gerakan anda benar',
      html: 'Notif ini akan hilang dalam <b></b> milidetik.',
      timer: 4000,
      timerProgressBar: true,
      didOpen: () => {
        Swal.showLoading()
        timerInterval = setInterval(() => {
          const content = Swal.getHtmlContainer()
          if (content) {
            const b = content.querySelector('b')
            if (b) {
              b.textContent = Swal.getTimerLeft()
            }
          }
        }, 100)
      },
      willClose: () => {
        clearInterval(timerInterval)
      }
    }).then((result) => {
      /* Read more about handling dismissals below */
      if (result.dismiss === Swal.DismissReason.timer) {
        console.log('I was closed by the timer')
      }
    })

}

function alertsalah(text){
  let timerInterval;
    Swal.fire({
      title: 'Terdeteksi : '+text+' Gerakan anda salah',
      html: 'Notif ini akan hilang dalam <b></b> milidetik.',
      timer: 4000,
      timerProgressBar: true,
      didOpen: () => {
        Swal.showLoading()
        timerInterval = setInterval(() => {
          const content = Swal.getHtmlContainer()
          if (content) {
            const b = content.querySelector('b')
            if (b) {
              b.textContent = Swal.getTimerLeft()
            }
          }
        }, 100)
      },
      willClose: () => {
        clearInterval(timerInterval)
      }
    }).then((result) => {
      /* Read more about handling dismissals below */
      if (result.dismiss === Swal.DismissReason.timer) {
        console.log('I was closed by the timer')
      }
    })
  }