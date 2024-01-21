// 悬浮预热器的热量收支计算方程流程
// 部分常量定义
// 各个气体的体积分数
const carbonMonoxideVolumeFraction = 0.1;
const carbonDioxideVolumeFraction = 0.1;
const waterVaporVolumeFraction = 0.1;
const oxygenVolumeFraction = 0.2;
const nitrogenVolumeFraction = 0.2;
// 各个气体的常压下密度
const carbonMonoxideDensity = 1.14;
const carbonDioxideDensity = 1.98;
const waterVaporDensity = 0.6;
const oxygenDensity = 1.429;
const nitrogenDensity = 0.81;
const liquidWaterDensity = 1000;
const standardAirDensity = 1.293; // 标准情况下的空气密度
// 各个气体的比热
const carbonMonoxideSpecificHeat = 1040;
const carbonDioxideSpecificHeat = 840;
const waterVaporSpecificHeat = 1850;
const oxygenSpecificHeat = 918;
const nitrogenSpecificHeat = 1040;
const liquidWaterSpecificHeat = 4200;
// 温度常量
const waterVaporTemperature = 100;
// 流程执行函数
export function fun2(){

}

// 1.进入悬浮预热器的物质总和
function cal_total_massStream_enteringNode(){

}
// 1-1.进入的生料量
function cal_rawMaterial_massStream_enteringNode(hourlyRawMaterial, hourlyClinkerProduction){
    let rawMaterialMassStream = hourlyRawMaterial / hourlyClinkerProduction;
    return rawMaterialMassStream;
}
// 1-2.进入的空气（生料代入的空气）
function cal_air_massStream_enteringNode(hourlyAirVolume, hourlyClinkerProduction){
    let airMassStream = hourlyAirVolume * standardAirDensity / hourlyClinkerProduction;
    return airMassStream;
}
// 1-3.来自分解炉的废气
function cal_wasterGas_massStream_enteringNode(hourlyWasterGasVolume, hourlyClinkerProduction){
    let wasterGasDensity = (
        carbonMonoxideDensity * carbonMonoxideVolumeFraction +
        carbonDioxideDensity * carbonDioxideVolumeFraction+
        waterVaporDensity * waterVaporVolumeFraction +
        oxygenDensity * oxygenVolumeFraction +
        nitrogenDensity * nitrogenVolumeFraction
    ) / 100;

    let wasterGasMassStream = (hourlyWasterGasVolume * wasterGasDensity) / hourlyClinkerProduction;
    return wasterGasMassStream;
}
// 1-4.来自分解炉的飞灰
function cal_Ash_massStream_enteringNode(ashConcentration, hourlyWasteGasVolume, hourlyClinkerProduction){
    let ashMassStream = (ashConcentration * hourlyWasteGasVolume) / hourlyClinkerProduction;
    return ashMassStream;
}

// 2.进入悬浮预热器的能量总和
function cal_total_energyStream_enteringNode(){

}
// 2-1.进入的生料量的显热
function cal_rawMaterial_sensible_enteringNode(){

}
// 2-2.进入的空气显热（生料代入的空气）
function cal_air_sensible_enteringNode(){

}
// 2-3.来自分解炉的废气显热
function cal_wasterGas_sensible_enteringNode(){

}
// 1-4.来自分解炉的飞灰显热
function cal_Ash_sensible_enteringNode(){

}
// 3.离开悬浮预热器的物质总和

// 4.离开悬浮预热器的能量总和