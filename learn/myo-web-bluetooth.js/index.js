//window.onload = function(){
  
  // let button = document.getElementById("connect");
  let connection = document.getElementById("connection");
  let disco = document.getElementById("dissconnect");
  let message = document.getElementById("message");

  if ( 'bluetooth' in navigator === false ) {
      button.style.display = 'none';
      message.innerHTML = 'This browser doesn\'t support the <a href="https://developer.mozilla.org/en-US/docs/Web/API/Web_Bluetooth_API" target="_blank">Web Bluetooth API</a> :(';
  }
  
  let renderer, scene, camera;
  var mesh;
  let temp;
  let accelerometerData, gyroscopeData, poseData, emgData,
  orientationData, batteryLevel, armType, armSynced, myoDirection, myoLocked;
  var dataFeature = []; //totalnya 126 baris data
  var accelerometer_tmp = []; // 2 detik ada 150an
  var gyroscope_tmp = [];
  var orientation_tmp= [];
  var euler_tmp = [];
  var emg_tmp = [];
  var sendData = [];
  var strOutput;
  var Pod0 = []; var Pod1 = []; var Pod2 = []; var Pod3 = []; var Pod4 =[]; var Pod5 = []; var Pod6 = []; var Pod7 = []; //untuk nampung tiap tiap pod
    
  var emg_data_tmp = [];

  // var dataFitur = {};
  var isRecording =false;

  
  var axis = new THREE.Vector3();
	var quaternion = new THREE.Quaternion();
	var quaternionHome = new THREE.Quaternion();
	var initialised = false;
	var timeout = null;
  
  connection.onclick = function(e){
    var myoController = new MyoWebBluetooth("Myo");
    myoController.connect();

    myoController.onStateChange(function(state){

      accelerometerData = state.accelerometer;
      gyroscopeData = state.gyroscope;
      emgData = state.emgData;
      orientationData = state.orientation;
      eulerData = state.euler;
      displayData();
    });
  }

  disco.onclick = function(e){
    var myoController = new MyoWebBluetooth("Myo");
    myoController.disconnect();
  }
  // init();
  // render();

  function init(){
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.001, 10 );

    renderer = new THREE.WebGLRenderer({alpha: true, antialias: true});
    renderer.setSize( window.innerWidth, window.innerHeight );
    document.getElementsByClassName('container')[0].appendChild( renderer.domElement );

    // var loader = new THREE.JSONLoader()
    // loader.load('myo.json', function(geometry){
    //   var material = new THREE.MeshPhongMaterial( { color: 0x888899, shininess: 15, side: THREE.DoubleSide } );
		// 		mesh = new THREE.Mesh( geometry, material );
    //     mesh.rotation.x = 0.5;
    //     mesh.scale.set(0.5, 0.5, 0.5);
		// 		scene.add( mesh );
    // })

    var geometry = new THREE.BoxGeometry(1, 1, 1);
    var material = new THREE.MeshPhongMaterial({color: 0x888899, shininess: 15, side: THREE.DoubleSide });
    mesh = new THREE.Mesh(geometry, material);
    mesh.rotation.x = 0.5;
    scene.add(mesh);

    var light = new THREE.HemisphereLight( 0xddddff, 0x808080, 0.7 );
  			light.position.set( 0, 1, 0 );
  			scene.add( light );

		var light = new THREE.DirectionalLight( 0xffffff, 0.6 );
  			light.position.set( 1, 1, 1 );
  			scene.add( light );

		var light = new THREE.DirectionalLight( 0xffffff, 0.4 );
  			light.position.set( 1, -1, 1 );
  			scene.add( light );

    camera.position.z = 5;
    //console.log('saya');
  }

  function render(){
    requestAnimationFrame(render);
    renderer.render(scene, camera);
  }

  function displayData(){
    var idalat = document.getElementById("idalat"); 
    idalat.innerHTML = "Myo Armband Telah Terkoneksi";
    if(orientationData){
      var orientationXDiv = document.getElementsByClassName('orientation-x-data')[0];
      orientationXDiv.innerHTML = orientationData.x;

      var orientationYDiv = document.getElementsByClassName('orientation-y-data')[0];
      orientationYDiv.innerHTML = orientationData.y;

      var orientationZDiv = document.getElementsByClassName('orientation-z-data')[0];
      orientationZDiv.innerHTML = orientationData.z;
    }

    if(eulerData){
      var eulerXDiv = document.getElementsByClassName('euler-x-data')[0];
      eulerXDiv.innerHTML = eulerData.x;

      var eulerYDiv = document.getElementsByClassName('euler-y-data')[0];
      eulerYDiv.innerHTML = eulerData.y;

      var eulerZDiv = document.getElementsByClassName('euler-z-data')[0];
      eulerZDiv.innerHTML = eulerData.z;
    }


    if(accelerometerData){
      var accelerometerXDiv = document.getElementsByClassName('accelerometer-x-data')[0];
      accelerometerXDiv.innerHTML = accelerometerData.x;

      var accelerometerYDiv = document.getElementsByClassName('accelerometer-y-data')[0];
      accelerometerYDiv.innerHTML = accelerometerData.y;

      var accelerometerZDiv = document.getElementsByClassName('accelerometer-z-data')[0];
      accelerometerZDiv.innerHTML = accelerometerData.z;
    }

    if(gyroscopeData){
      var gyroscopeXDiv = document.getElementsByClassName('gyroscope-x-data')[0];
      gyroscopeXDiv.innerHTML = gyroscopeData.x;

      var gyroscopeYDiv = document.getElementsByClassName('gyroscope-y-data')[0];
      gyroscopeYDiv.innerHTML = gyroscopeData.y;

      var gyroscopeZDiv = document.getElementsByClassName('gyroscope-z-data')[0];
      gyroscopeZDiv.innerHTML = gyroscopeData.z;
    }

    if(emgData){
      var emgDiv = document.getElementsByClassName('emg-data')[0];
      emgDiv.innerHTML = emgData;

    }
    

    if(isRecording){
      record();
      
    }    
  }

  function rekam() {
    
    isRecording = !isRecording;
    //console.log(isRecording);
    count = 0;
    
    setTimeout(function () {
      isRecording = !isRecording;
      //isRecording = false;
      //console.log("mau kirimmm",sendData);
      var paket = sendData;
      paket = paket.substring(1,paket.length-1);
      //console.log("apakah paket");
      const coma = ',';
      const replaceWith = ';';
      //paket.replaceAll(",",";");
      //paket.split(coma).join(replaceWith);
      //console.log(typeof paket);
      for (i = 0; i<paket.length; i++){
        paket = paket.replace(coma,replaceWith);
      }
      console.log(paket);
      predict(paket);
    }, 3000);
  }
  function rekamKata() {
    isRecording = !isRecording;
    //console.log(isRecording);
    count = 0;
    
    setTimeout(function () {
      isRecording = !isRecording;
      //isRecording = false;
      //console.log("mau kirimmm",sendData);
      var paket = sendData;
      paket = paket.substring(1,paket.length-1);
      //console.log("apakah paket");
      const coma = ',';
      const replaceWith = ';';
      //paket.replaceAll(",",";");
      //paket.split(coma).join(replaceWith);
      //console.log(typeof paket);
      for (i = 0; i<paket.length; i++){
        paket = paket.replace(coma,replaceWith);
      }
      console.log(paket);
      predictKata(paket);
    }, 3000);
  }
  function rekamKuis() {
    isRecording = !isRecording;
    //console.log(isRecording);
    count = 0;
    
    setTimeout(function () {
      isRecording = !isRecording;
      //isRecording = false;
      //console.log("mau kirimmm",sendData);
      var paket = sendData;
      paket = paket.substring(1,paket.length-1);
      //console.log("apakah paket");
      const coma = ',';
      const replaceWith = ';';
      //paket.replaceAll(",",";");
      //paket.split(coma).join(replaceWith);
      //console.log(typeof paket);
      for (i = 0; i<paket.length; i++){
        paket = paket.replace(coma,replaceWith);
      }
      console.log(paket);
      predictKuis(paket);
    }, 3000);
  }
  function record(){
    // dataFitur.assign({}, accelerometerData)
    
    accelerometer_tmp.push(accelerometerData);
    gyroscope_tmp.push(gyroscopeData);
    orientation_tmp.push(orientationData);
    euler_tmp.push(eulerData);
    emg_tmp.push(emgData);
    //console.log("emgdata", emgData);
    //console.log("hasil datafitur");

    //var total = accelerometer_tmp.length; //150
    //console.log(total);
    CalculateData();
  }

  function CalculateData(){
    //accelerometer 
    var AccX = saveOneAxisX(accelerometer_tmp);
    var AccY = saveOneAxisY(accelerometer_tmp);
    var AccZ = saveOneAxisZ(accelerometer_tmp);

    // console.log("hasil ACCX , ACCY, ACCZ");
    // console.log(AccX);
    // console.log(AccY);
    // console.log(AccZ);
    var AccMeanX = CalculateMean(AccX);
    var AccMeanY = CalculateMean(AccY);
    var AccMeanZ = CalculateMean(AccZ);
    //console.log("Mean XYZ : ", AccMeanX, AccMeanY, AccMeanZ);

    var AccMedianX = CalculateMedian(AccX);
    var AccMedianY = CalculateMedian(AccY);
    var AccMedianZ = CalculateMedian(AccZ);
    //console.log("Median XYZ : ", AccMedianX, AccMedianY, AccMedianZ);

    var AccVarianceX = CalculateVariance(AccX);
    var AccVarianceY = CalculateVariance(AccY);
    var AccVarianceZ = CalculateVariance(AccZ);
    //console.log("Variance XYZ : ", AccVarianceX, AccVarianceY, AccVarianceZ);

    var AccDevianceX = CalculateDeviance(AccX);
    var AccDevianceY = CalculateDeviance(AccY);
    var AccDevianceZ = CalculateDeviance(AccZ);
    //console.log("Deviance XYZ : ", AccDevianceX, AccDevianceY, AccDevianceZ);

    var AccSkewnessX = CalculateSkewness(AccX);
    var AccSkewnessY = CalculateSkewness(AccY);
    var AccSkewnessZ = CalculateSkewness(AccZ);
   //console.log("Skewness XYZ : ", AccSkewnessX, AccSkewnessY, AccSkewnessZ);

    var AccKurtosisX = CalculateKurtosis(AccX);
    var AccKurtosisY = CalculateKurtosis(AccY);
    var AccKurtosisZ = CalculateKurtosis(AccZ);
    //console.log("Kurtosis XYZ : ", AccKurtosisX, AccKurtosisY, AccKurtosisZ);
    
    //gyroscope
    var GyrX = saveOneAxisX(gyroscope_tmp);
    var GyrY = saveOneAxisY(gyroscope_tmp);
    var GyrZ = saveOneAxisZ(gyroscope_tmp);
    
    var GyrMeanX = CalculateMean(GyrX);
    var GyrMeanY = CalculateMean(GyrY);
    var GyrMeanZ = CalculateMean(GyrZ);
    //console.log("G Mean XYZ : ", GyrMeanX, GyrMeanY, GyrMeanZ);

    var GyrMedianX = CalculateMedian(GyrX);
    var GyrMedianY = CalculateMedian(GyrY);
    var GyrMedianZ = CalculateMedian(GyrZ);
    //console.log("G Median XYZ : ", GyrMedianX, GyrMedianY, GyrMedianZ);

    var GyrVarianceX = CalculateVariance(GyrX);
    var GyrVarianceY = CalculateVariance(GyrY);
    var GyrVarianceZ = CalculateVariance(GyrZ);
    //console.log("G Variance XYZ : ", GyrVarianceX, GyrVarianceY, GyrVarianceZ);

    var GyrDevianceX = CalculateDeviance(GyrX);
    var GyrDevianceY = CalculateDeviance(GyrY);
    var GyrDevianceZ = CalculateDeviance(GyrZ);
    //console.log("G Deviance XYZ : ", GyrDevianceX, GyrDevianceY, GyrDevianceZ);

    var GyrSkewnessX = CalculateSkewness(GyrX);
    var GyrSkewnessY = CalculateSkewness(GyrY);
    var GyrSkewnessZ = CalculateSkewness(GyrZ);
    //console.log("G Skewness XYZ : ", GyrSkewnessX, GyrSkewnessY, GyrSkewnessZ);

    var GyrKurtosisX = CalculateKurtosis(GyrX);
    var GyrKurtosisY = CalculateKurtosis(GyrY);
    var GyrKurtosisZ = CalculateKurtosis(GyrZ);
    //console.log("G Kurtosis XYZ : ", GyrKurtosisX, GyrKurtosisY, GyrKurtosisZ);

    //orientation
    var OriX = saveOneAxisX(orientation_tmp);
    var OriY = saveOneAxisY(orientation_tmp);
    var OriZ = saveOneAxisZ(orientation_tmp);
    var OriW = saveOneAxisW(orientation_tmp);

    var OriMeanX = CalculateMean(OriX);
    var OriMeanY = CalculateMean(OriY);
    var OriMeanZ = CalculateMean(OriZ);
    var OriMeanW = CalculateMean(OriW);
    //console.log("O Mean XYZ : ", OriMeanX, OriMeanY, OriMeanZ, OriMeanW);

    var OriMedianX = CalculateMedian(OriX);
    var OriMedianY = CalculateMedian(OriY);
    var OriMedianZ = CalculateMedian(OriZ);
    var OriMedianW = CalculateMedian(OriW);
    //console.log("O Median XYZ : ", OriMedianX, OriMedianY, OriMedianZ, OriMedianW);

    var OriVarianceX = CalculateVariance(OriX);
    var OriVarianceY = CalculateVariance(OriY);
    var OriVarianceZ = CalculateVariance(OriZ);
    var OriVarianceW = CalculateVariance(OriW);
    //console.log("O Variance XYZ : ", OriVarianceX, OriVarianceY, OriVarianceZ, OriVarianceW);

    var OriDevianceX = CalculateDeviance(OriX);
    var OriDevianceY = CalculateDeviance(OriY);
    var OriDevianceZ = CalculateDeviance(OriZ);
    var OriDevianceW = CalculateDeviance(OriW);
    //console.log("O Deviance XYZ : ", OriDevianceX, OriDevianceY, OriDevianceZ, OriDevianceW);

    var OriSkewnessX = CalculateSkewness(OriX);
    var OriSkewnessY = CalculateSkewness(OriY);
    var OriSkewnessZ = CalculateSkewness(OriZ);
    var OriSkewnessW = CalculateSkewness(OriW);
    //console.log("O Skewness XYZ : ", OriSkewnessX, OriSkewnessY, OriSkewnessZ, OriSkewnessW);

    var OriKurtosisX = CalculateKurtosis(OriX);
    var OriKurtosisY = CalculateKurtosis(OriY);
    var OriKurtosisZ = CalculateKurtosis(OriZ);
    var OriKurtosisW = CalculateKurtosis(OriW);
    //console.log("O Kurtosis XYZ : ", OriKurtosisX, OriKurtosisY, OriKurtosisZ, OriKurtosisW);

    //Euler
    var EulerX = saveOneAxisX(euler_tmp);
    var EulerY = saveOneAxisY(euler_tmp);
    var EulerZ = saveOneAxisZ(euler_tmp);
    
    var EulerMeanX = CalculateMean(EulerX);
    var EulerMeanY = CalculateMean(EulerY);
    var EulerMeanZ = CalculateMean(EulerZ);
    //console.log("E Mean XYZ : ", EulerMeanX, EulerMeanY, EulerMeanZ);

    var EulerMedianX = CalculateMedian(EulerX);
    var EulerMedianY = CalculateMedian(EulerY);
    var EulerMedianZ = CalculateMedian(EulerZ);
    //console.log("E Median XYZ : ", EulerMedianX, EulerMedianY, EulerMedianZ);

    var EulerVarianceX = CalculateVariance(EulerX);
    var EulerVarianceY = CalculateVariance(EulerY);
    var EulerVarianceZ = CalculateVariance(EulerZ);
    //console.log("E Variance XYZ : ", EulerVarianceX, EulerVarianceY, EulerVarianceZ);

    var EulerDevianceX = CalculateDeviance(EulerX);
    var EulerDevianceY = CalculateDeviance(EulerY);
    var EulerDevianceZ = CalculateDeviance(EulerZ);
    //console.log("E Deviance XYZ : ", EulerDevianceX, EulerDevianceY, EulerDevianceZ);

    var EulerSkewnessX = CalculateSkewness(EulerX);
    var EulerSkewnessY = CalculateSkewness(EulerY);
    var EulerSkewnessZ = CalculateSkewness(EulerZ);
    //console.log("E Skewness XYZ : ", EulerSkewnessX, EulerSkewnessY, EulerSkewnessZ);

    var EulerKurtosisX = CalculateKurtosis(EulerX);
    var EulerKurtosisY = CalculateKurtosis(EulerY);
    var EulerKurtosisZ = CalculateKurtosis(EulerZ);
    //console.log("E Kurtosis XYZ : ", EulerKurtosisX, EulerKurtosisY, EulerKurtosisZ);

    //emg
    //var Pod0 = []; var Pod1 = []; var Pod2 = []; var Pod3 = []; var Pod4 =[]; var Pod5 = []; var Pod6 = []; var Pod7 = []; //untuk nampung tiap tiap pod
    
    //var emg_data_tmp = [];
    for (var i = 0; i < emg_tmp.length; i++) {
      if(emg_tmp[i] != null)
        emg_data_tmp.push(emg_tmp[i]);
    }
    
    //console.log("emg hasil potongan ",emg_data_tmp);
    for (var i = 0; i < emg_data_tmp.length; i++) {
      Pod0.push(emg_data_tmp[i][0]);
      Pod1.push(emg_data_tmp[i][1]);
      Pod2.push(emg_data_tmp[i][2]);
      Pod3.push(emg_data_tmp[i][3]);
      Pod4.push(emg_data_tmp[i][4]);
      Pod5.push(emg_data_tmp[i][5]);
      Pod6.push(emg_data_tmp[i][6]);
      Pod7.push(emg_data_tmp[i][7]);
    }
  
    var Pod0Mean = CalculateMean(Pod0);
    var Pod1Mean = CalculateMean(Pod1);
    var Pod2Mean = CalculateMean(Pod2);
    var Pod3Mean = CalculateMean(Pod3);
    var Pod4Mean = CalculateMean(Pod4);
    var Pod5Mean = CalculateMean(Pod5);
    var Pod6Mean = CalculateMean(Pod6);
    var Pod7Mean = CalculateMean(Pod7);
    //console.log("Pod Mean : ", Pod0Mean, Pod1Mean, Pod2Mean, Pod3Mean, Pod4Mean, Pod5Mean, Pod6Mean, Pod7Mean);

    var Pod0Median = CalculateMedian(Pod0);
    var Pod1Median = CalculateMedian(Pod1);
    var Pod2Median = CalculateMedian(Pod2);
    var Pod3Median = CalculateMedian(Pod3);
    var Pod4Median = CalculateMedian(Pod4);
    var Pod5Median = CalculateMedian(Pod5);
    var Pod6Median = CalculateMedian(Pod6);
    var Pod7Median = CalculateMedian(Pod7);
    //console.log("Pod Median : ", Pod0Median, Pod1Median, Pod2Median, Pod3Median, Pod4Median, Pod5Median, Pod6Median, Pod7Median);

    var Pod0Variance = CalculateVariance(Pod0);
    var Pod1Variance = CalculateVariance(Pod1);
    var Pod2Variance = CalculateVariance(Pod2);
    var Pod3Variance = CalculateVariance(Pod3);
    var Pod4Variance = CalculateVariance(Pod4);
    var Pod5Variance = CalculateVariance(Pod5);
    var Pod6Variance = CalculateVariance(Pod6);
    var Pod7Variance = CalculateVariance(Pod7);
    //console.log("Pod Variance : ", Pod0Variance, Pod1Variance, Pod2Variance, Pod3Variance, Pod4Variance, Pod5Variance, Pod6Variance, Pod7Variance);

    var Pod0Deviance = CalculateDeviance(Pod0);
    var Pod1Deviance = CalculateDeviance(Pod1);
    var Pod2Deviance = CalculateDeviance(Pod2);
    var Pod3Deviance = CalculateDeviance(Pod3);
    var Pod4Deviance = CalculateDeviance(Pod4);
    var Pod5Deviance = CalculateDeviance(Pod5);
    var Pod6Deviance = CalculateDeviance(Pod6);
    var Pod7Deviance = CalculateDeviance(Pod7);
    //console.log("Pod Deviance : ", Pod0Deviance, Pod1Deviance, Pod2Deviance, Pod3Deviance, Pod4Deviance, Pod5Deviance, Pod6Deviance, Pod7Deviance);

    var Pod0Skewness = CalculateSkewness(Pod0);
    var Pod1Skewness = CalculateSkewness(Pod1);
    var Pod2Skewness = CalculateSkewness(Pod2);
    var Pod3Skewness = CalculateSkewness(Pod3);
    var Pod4Skewness = CalculateSkewness(Pod4);
    var Pod5Skewness = CalculateSkewness(Pod5);
    var Pod6Skewness = CalculateSkewness(Pod6);
    var Pod7Skewness = CalculateSkewness(Pod7);
    //console.log("Pod Skewness : ", Pod0Skewness, Pod1Skewness, Pod2Skewness, Pod3Skewness, Pod4Skewness, Pod5Skewness, Pod6Skewness, Pod7Skewness);

    var Pod0Kurtosis = CalculateKurtosis(Pod0);
    var Pod1Kurtosis = CalculateKurtosis(Pod1);
    var Pod2Kurtosis = CalculateKurtosis(Pod2);
    var Pod3Kurtosis = CalculateKurtosis(Pod3);
    var Pod4Kurtosis = CalculateKurtosis(Pod4);
    var Pod5Kurtosis = CalculateKurtosis(Pod5);
    var Pod6Kurtosis = CalculateKurtosis(Pod6);
    var Pod7Kurtosis = CalculateKurtosis(Pod7);
    //console.log("Pod Kurtosis : ", Pod0Kurtosis, Pod1Kurtosis, Pod2Kurtosis, Pod3Kurtosis, Pod4Kurtosis, Pod5Kurtosis, Pod6Kurtosis, Pod7Kurtosis);

    dataFeature[0] = AccMeanX;
    dataFeature[1] = AccMeanY;
    dataFeature[2] = AccMeanZ;
    dataFeature[3] = AccMedianX;
    dataFeature[4] = AccMedianY;
    dataFeature[5] = AccMedianZ;
    dataFeature[6] = AccVarianceX;
    dataFeature[7] = AccVarianceY;
    dataFeature[8] = AccVarianceZ;
    dataFeature[9] = AccDevianceX;
    dataFeature[10] = AccDevianceY;
    dataFeature[11] = AccDevianceZ;
    dataFeature[12] = AccSkewnessX;
    dataFeature[13] = AccSkewnessY;
    dataFeature[14] = AccSkewnessZ;
    dataFeature[15] = AccKurtosisX;
    dataFeature[16] = AccKurtosisY;
    dataFeature[17] = AccKurtosisZ;
    dataFeature[18] = GyrMeanX;
    dataFeature[19] = GyrMeanY;
    dataFeature[20] = GyrMeanZ;
    dataFeature[21] = GyrMedianX;
    dataFeature[22] = GyrMedianY;
    dataFeature[23] = GyrMedianZ;
    dataFeature[24] = GyrVarianceX;
    dataFeature[25] = GyrVarianceY;
    dataFeature[26] = GyrVarianceZ;
    dataFeature[27] = GyrDevianceX;
    dataFeature[28] = GyrDevianceY;
    dataFeature[29] = GyrDevianceZ;
    dataFeature[30] = GyrSkewnessX;
    dataFeature[31] = GyrSkewnessY;
    dataFeature[32] = GyrSkewnessZ;
    dataFeature[33] = GyrKurtosisX;
    dataFeature[34] = GyrKurtosisY;
    dataFeature[35] = GyrKurtosisZ;
    dataFeature[36] = OriMeanX;
    dataFeature[37] = OriMeanY;
    dataFeature[38] = OriMeanZ;
    dataFeature[39] = OriMeanW;
    dataFeature[40] = OriMedianX;
    dataFeature[41] = OriMedianY;
    dataFeature[42] = OriMedianZ;
    dataFeature[43] = OriMedianW;
    dataFeature[44] = OriVarianceX;
    dataFeature[45] = OriVarianceY;
    dataFeature[46] = OriVarianceZ;
    dataFeature[47] = OriVarianceW;
    dataFeature[48] = OriDevianceX;
    dataFeature[49] = OriDevianceY;
    dataFeature[50] = OriDevianceZ;
    dataFeature[51] = OriDevianceW;
    dataFeature[52] = OriSkewnessX;
    dataFeature[53] = OriSkewnessY;
    dataFeature[54] = OriSkewnessZ;
    dataFeature[55] = OriSkewnessW;
    dataFeature[56] = OriKurtosisX;
    dataFeature[57] = OriKurtosisY;
    dataFeature[58] = OriKurtosisZ;
    dataFeature[59] = OriKurtosisW;
    dataFeature[60] = EulerMeanX;
    dataFeature[61] = EulerMeanY;
    dataFeature[62] = EulerMeanZ;
    dataFeature[63] = EulerMedianX;
    dataFeature[64] = EulerMedianY;
    dataFeature[65] = EulerMedianZ;
    dataFeature[66] = EulerVarianceX;
    dataFeature[67] = EulerVarianceY;
    dataFeature[68] = EulerVarianceZ;
    dataFeature[69] = EulerDevianceX;
    dataFeature[70] = EulerDevianceY;
    dataFeature[71] = EulerDevianceZ;
    dataFeature[72] = EulerSkewnessX;
    dataFeature[73] = EulerSkewnessY;
    dataFeature[74] = EulerSkewnessZ;
    dataFeature[75] = EulerKurtosisX;
    dataFeature[76] = EulerKurtosisY;
    dataFeature[77] = EulerKurtosisZ;
    dataFeature[78] = Pod0Mean;
    dataFeature[79] = Pod1Mean;
    dataFeature[80] = Pod2Mean;
    dataFeature[81] = Pod3Mean;
    dataFeature[82] = Pod4Mean;
    dataFeature[83] = Pod5Mean;
    dataFeature[84] = Pod6Mean;
    dataFeature[85] = Pod7Mean;
    dataFeature[86] = Pod0Median;
    dataFeature[87] = Pod1Median;
    dataFeature[88] = Pod2Median;
    dataFeature[89] = Pod3Median;
    dataFeature[90] = Pod4Median;
    dataFeature[91] = Pod5Median;
    dataFeature[92] = Pod6Median;
    dataFeature[93] = Pod7Median;
    dataFeature[94] = Pod0Variance;
    dataFeature[95] = Pod1Variance;
    dataFeature[96] = Pod2Variance;
    dataFeature[97] = Pod3Variance;
    dataFeature[98] = Pod4Variance;
    dataFeature[99] = Pod5Variance;
    dataFeature[100] = Pod6Variance;
    dataFeature[101] = Pod7Variance;
    dataFeature[102] = Pod0Deviance;
    dataFeature[103] = Pod1Deviance;
    dataFeature[104] = Pod2Deviance;
    dataFeature[105] = Pod3Deviance;
    dataFeature[106] = Pod4Deviance;
    dataFeature[107] = Pod5Deviance;
    dataFeature[108] = Pod6Deviance;
    dataFeature[109] = Pod7Deviance;
    dataFeature[110] = Pod0Skewness;
    dataFeature[111] = Pod1Skewness;
    dataFeature[112] = Pod2Skewness;
    dataFeature[113] = Pod3Skewness;
    dataFeature[114] = Pod4Skewness;
    dataFeature[115] = Pod5Skewness;
    dataFeature[116] = Pod6Skewness;
    dataFeature[117] = Pod7Skewness;
    dataFeature[118] = Pod0Kurtosis;
    dataFeature[119] = Pod1Kurtosis;
    dataFeature[120] = Pod2Kurtosis;
    dataFeature[121] = Pod3Kurtosis;
    dataFeature[122] = Pod4Kurtosis;
    dataFeature[123] = Pod5Kurtosis;
    dataFeature[124] = Pod6Kurtosis;
    dataFeature[125] = Pod7Kurtosis;

    sendData = JSON.stringify(dataFeature);
    //console.log(sendData);
  }
    
    const predict = async(data) => {
      const url = "http://34.101.133.218:8000/myo";
      const token = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpZCI6MjEsImlkX3VzZXIiOjEsInByb2plY3RfbmFtZSI6Im15byJ9.C86EDPQjTGz8UqpDpAbupF5eB9QPO2y_4OPj756IfNk";
      let bodyFormData = new FormData();
      bodyFormData.append('test', data);
      axios({
          method: "post",
          url:  url,
          data: bodyFormData,
          headers: { //"Content-Type": "multipart/form-data" 
            "Authorization": "Bearer " + token
          },
        })
          .then(function (response) {
            strOutput = response.data.values;
            strOutput = strOutput[0];
            if(huruf){
              checkNotif(strOutput,huruf);
            }
  
          })
          .catch(function (error) {
            console.log(error);
          });
          clearData();
  }

  const predictKata = async(data) => {
    const url = "http://34.101.133.218:8000/myo";
    const token = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpZCI6MjEsImlkX3VzZXIiOjEsInByb2plY3RfbmFtZSI6Im15byJ9.C86EDPQjTGz8UqpDpAbupF5eB9QPO2y_4OPj756IfNk";
    let bodyFormData = new FormData();
    bodyFormData.append('test', data);
    axios({
        method: "post",
        url:  url,
        data: bodyFormData,
        headers: { //"Content-Type": "multipart/form-data" 
          "Authorization": "Bearer " + token
        },
      })
        .then(function (response) {
          strOutput = response.data.values;
          strOutput = strOutput[0];
          if(kata){
            checkNotif(strOutput,kata);
          }

        })
        .catch(function (error) {
          console.log(error);
        });
        clearData();

}

  const predictKuis = async(data) => {
    const url = "http://34.101.133.218:8000/myo";
    const token = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpZCI6MjEsImlkX3VzZXIiOjEsInByb2plY3RfbmFtZSI6Im15byJ9.C86EDPQjTGz8UqpDpAbupF5eB9QPO2y_4OPj756IfNk";
    let bodyFormData = new FormData();
    bodyFormData.append('test', data);
    axios({
        method: "post",
        url:  url,
        data: bodyFormData,
        headers: { //"Content-Type": "multipart/form-data" 
          "Authorization": "Bearer " + token
        },
      })
        .then(function (response) {
          //console.log(response.data.values);
          strOutput = response.data.values;

          strOutput = strOutput[0];
          checkNotif(strOutput,stringIMG);

        })
        .catch(function (error) {
          console.log(error);
        });
        clearData();
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
  function saveOneAxisX(value){
    var i;
    var x = [];
    for (i = 0; i < value.length; i++) {
      x.push(value[i].x);
    }
    return x;
  }

  function saveOneAxisY(value){
    var i;
    var x = [];
    for (i = 0; i < value.length; i++) {
      x.push(value[i].y);
    }
    return x;
  }

  function saveOneAxisZ(value){
    var i;
    var x = [];
    for (i = 0; i < value.length; i++) {
      x.push(value[i].z);
    }
    return x;
  }

  function saveOneAxisW(value){
    var i;
    var x = [];
    for (i = 0; i < value.length; i++) {
      x.push(value[i].w);
    }
    return x;
  }
  function cutDecimals(number,decimals){
    return parseFloat(number.toLocaleString('fullwide', {maximumFractionDigits:decimals}));
  }
  function CalculateMean(values){
    var i;
    var mean = 0.0;
    
    for (i = 0; i < values.length; i++) {
      mean+=values[i];
    }
    mean = mean/values.length;
    return mean;
  }

  function CalculateMedian(values){
    var median = 0;
    if(values.length ===0) return 0;

    values.sort(function(a,b){
      return a-b;
    });
  
    var half = Math.floor(values.length / 2);
  
    if (values.length % 2 == 0){
      median = values[half];
      return median;
    }else
      median = (values[half - 1] + values[half]) / 2.0;
      return median;
  }

  function CalculateVariance(values){
    var i;
    var mean = CalculateMean(values);
    var variance = 0.0;
    
    for (i = 0; i < values.length; i++) {
      variance +=  (Math.pow((values[i]- mean), 2));
    }
    variance = variance / (values.length - 1);
    return variance;
  }

  function CalculateDeviance(values){
    var deviance = 0.0;
    deviance = Math.sqrt(CalculateVariance(values)); 
    return deviance;
  }

  function CalculateSkewness(values){
    var i ;
    var size = 0;
    var skewness = 0.0;
    var mean = CalculateMean(values);
    var deviance = CalculateDeviance(values);

    for (i = 0; i < values.length; i++) {
      var overDeviance;
      if(deviance == 0)
        overDeviance = 0;
      else
        overDeviance = ((values[i] - mean) / deviance);
      
      skewness = Math.pow(overDeviance,3);
      size++;
    }
    skewness = skewness / size;
    return skewness;
  }

  function CalculateKurtosis(values){
    var i;
    var size = 0;
    var kurtosis = 0.0
    var mean = CalculateMean(values);
    var deviance = CalculateDeviance(values);

    for (i = 0; i < values.length; i++) {
      var overDeviance;
      if(deviance == 0)
        overDeviance = 0;
      else
        overDeviance = ((values[i] - mean) / deviance);
      
        kurtosis = Math.pow(overDeviance,4);
      size++;
    }
    kurtosis = kurtosis / size;
    return kurtosis;
  }

  function clearData(){
    dataFeature = []; //totalnya 126 baris data
    accelerometer_tmp = []; // 2 detik ada 150an
    gyroscope_tmp = [];
    orientation_tmp= [];
    euler_tmp = [];
    emg_tmp = [];
    sendData = [];
    Pod0 = [];  Pod1 = []; Pod2 = [];  Pod3 = [];  Pod4 =[];  Pod5 = [];  Pod6 = [];  Pod7 = []; //untuk nampung tiap tiap pod
    emg_data_tmp = [];
  }

//}
