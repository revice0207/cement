// 冷却机的热量收支计算方程流程
// 部分常量定义
//////////////////////////////////////////////////////////////////////////////////////////////
// 各个一次空气的体积分数
const carbonMonoxideVolumeFractionFirst = 0.1;
const carbonDioxideVolumeFractionFirst = 0.1;
const waterVaporVolumeFractionFirst = 0.1;
const oxygenVolumeFractionFirst = 0.2;
const nitrogenVolumeFractionFirst = 0.2;
// 各个三次空气的体积分数
const carbonMonoxideVolumeFractionThird = 0.1;
const carbonDioxideVolumeFractionThird = 0.1;
const waterVaporVolumeFractionThird = 0.1;
const oxygenVolumeFractionThird = 0.2;
const nitrogenVolumeFractionThird = 0.2;
// 窑尾废气
const carbonMonoxideVolumeFractionWasterGas = 0.1;
const carbonDioxideVolumeFractionWasterGas = 0.1;
const waterVaporVolumeFractionWasterGas = 0.1;
const oxygenVolumeFractionWasterGas = 0.2;
const nitrogenVolumeFractionWasterGas = 0.2;
//////////////////////////////////////////////////////////////////////////////////////////////
// 各个气体的常压下密度
const carbonMonoxideDensity = 1.14;
const carbonDioxideDensity = 1.98;
const waterVaporDensity = 0.6;
const oxygenDensity = 1.429;
const nitrogenDensity = 0.81;
const liquidWaterDensity = 1000;
const standardAirDensity = 1.293; // 标准情况下的空气密度
//---------------------------------------------------------------------------------------------
// 各个一次空气的比热
const carbonMonoxideSpecificHeatFirst = 1040;
const carbonDioxideSpecificHeatFirst = 840;
const waterVaporSpecificHeatFirst = 1850;
const oxygenSpecificHeatFirst = 918;
const nitrogenSpecificHeatFirst = 1040;
// 各个三次空气的比热
const carbonMonoxideSpecificHeatThird = 1040;
const carbonDioxideSpecificHeatThird = 840;
const waterVaporSpecificHeatThird = 1850;
const oxygenSpecificHeatThird = 918;
const nitrogenSpecificHeatThird = 1040;
// 窑尾废气的比热
const carbonMonoxideSpecificHeatWasterGas = 1040;
const carbonDioxideSpecificHeatWasterGas = 840;
const waterVaporSpecificHeatWasterGas = 1850;
const oxygenSpecificHeatWasterGas = 918;
const nitrogenSpecificHeatWasterGas = 1040;

const coalPowderSpecificHeat = 1000;
const wasterGasSpecificHeat = 1100;
const ashSpecificHeat = 1200;
// 熟料的比热
const clinkerSpecificHeat = 1200;
//---------------------------------------------------------------------------------------------
// 温度常量
const waterVaporTemperature = 100;
// 流程执行函数

// 1.进入节点的物质流总量
export function fun2(){

}

function cal_total_massStream_enteringNode(hourlyAirVolume, hourlyClinkerProduction){
    let clinkerMassStream =  cal_clinker_massStream_enteringNode()
    let airMassStream = cal_air_massStream_enteringNode(hourlyAirVolume, hourlyClinkerProduction)
    let totalEnteringMassStream = clinkerMassStream + airMassStream;
    return totalEnteringMassStream;
}
// 1-1: 熟料进入的物质流
function cal_clinker_massStream_enteringNode(){
    let clinkerMassStream = 1;
    return clinkerMassStream;
}
// 1-2: 冷却空气的物质流
function cal_air_massStream_enteringNode(hourlyAirVolume, hourlyClinkerProduction){
    let airMassStream = hourlyAirVolume * standardAirDensity / hourlyClinkerProduction;
    return airMassStream;
}

function cal_total_sensible_enteringNode(){

}
// 2-1: 高温水泥熟料的显热
function cal_clinker_sensible_enteringNode(clinkerTemperature){
    let clinkerSensible = clinkerSpecificHeat * clinkerTemperature;
    return clinkerSensible
}
// 2-2: 冷却空气的显热
function cal_air_sensible_enteringNode(hourlyAirVolume, hourlyClinkerProduction, ){

}

function cal_total_massStream_leavingNode(){

}
// 3-1: 低温水泥熟料的物质流
function cal_clinker_massStream_leavingNode(){

}
// 3-2: 飞灰的物质流
function cal_ash_massStream_leavingNode(){

}
// 3-3: 冷却空气的物质流
function cal_air_massStream_leavingNode(){

}
// 3-4: 二次空气
function cal_secondAir_massStream_leavingNode(){

}
// 3-5: 三次空气
function cal_thirdAir_massStream_leavingNode(){

}
// 3-6: AQC空气
function cal_AQCAir_massStream_leavingNode(){

}

function cal_total_sensible_leavingNode(){

}
// 4-1: 低温水泥显热
function cal_clinker_sensible_leavingNode(){

}
// 4-2: 飞灰显热
function cal_ash_sensible_leavingNode(){

}
// 4-3: 冷却机空气显热
function cal_air_sensible_leavingNode(){

}
// 4-4: 二次空气显热
function cal_secondAir_sensible_leavingNode(){

}
// 4-5: 三次空气显热
function cal_thirdAir_sensible_leavingNode(){

}
// 4-6: AQC空气显热
function cal_AQCAir_sensible_leavingNode(){

}