// 悬浮预热器的热量收支计算方程流程
// 部分常量定义
// 各个气体的体积分数
const carbonMonoxideVolumeFraction = 0.1;
const carbonDioxideVolumeFraction = 0.1;
const waterVaporVolumeFraction = 0.1;
const oxygenVolumeFraction = 0.2;
const nitrogenVolumeFraction = 0.2;
const liquidWaterVolumeFraction = 0.1;
// 各个气体的常压下密度
const carbonMonoxideDensity = 1.14;
const carbonDioxideDensity = 1.98;
const waterVaporDensity = 0.6;
const oxygenDensity = 1.429;
const nitrogenDensity = 0.81;
// const liquidWaterDensity = 1000;
const standardAirDensity = 1.293; // 标准情况下的空气密度
// 各个气体的比热
const carbonMonoxideSpecificHeat = 1040;
const carbonDioxideSpecificHeat = 840;
const waterVaporSpecificHeat = 1850;
const oxygenSpecificHeat = 918;
const nitrogenSpecificHeat = 1040;
const liquidWaterSpecificHeat = 4200;
const standardAirSpecificHeat = 1.004;
// 温度常量
// const waterVaporTemperature = 100;
// 流程执行函数
export function fun2(
     hourlyRawMaterial,
     hourlyClinkerProduction,
     hourlyAirVolume,
     hourlyWasterGasVolume,
     ashConcentration,
     hourlyRawMaterialC5,
     rawMaterialTemperature,
     rawMaterialTemperatureC5,
     wasterTemperature,
     rawMaterialSpecificHeatC5,
     rawMaterialWaterContent,
     ashSpecificHeat,
     wasterGasTemperaturePH,
     heatOfVaporization,
     averageWasterGasSpecificHeat
){
    let totalEnteringMassStream = cal_total_massStream_enteringNode(hourlyRawMaterial, hourlyClinkerProduction, hourlyAirVolume, hourlyWasterGasVolume, ashConcentration)
    let totalEnteringSensible = cal_total_sensible_enteringNode(hourlyAirVolume, hourlyClinkerProduction, hourlyWasterGasVolume, rawMaterialTemperature, wasterTemperature, rawMaterialWaterContent, ashConcentration, ashSpecificHeat)
    let totalLeavingMassStream = cal_total_massStream_leavingNode(hourlyRawMaterialC5, hourlyClinkerProduction, hourlyWasterGasVolume, ashConcentration)
    let totalLeavingSensible = cal_total_sensible_leavingNode(
        hourlyRawMaterialC5,
        hourlyClinkerProduction,
        hourlyWasterGasVolume,
        hourlyRawMaterial,
        rawMaterialSpecificHeatC5,
        rawMaterialTemperatureC5,
        ashConcentration,
        rawMaterialWaterContent,
        averageWasterGasSpecificHeat,
        ashSpecificHeat,
        wasterGasTemperaturePH,
        heatOfVaporization
    )

    // 可计算物质流损失比和热效率
    let massStreamRatio = totalLeavingMassStream / totalEnteringMassStream * 100;
    let thermalEfficiency = totalLeavingSensible / totalEnteringSensible * 100;

    return [massStreamRatio, thermalEfficiency];
    //return [totalEnteringMassStream,totalEnteringSensible,totalLeavingMassStream,totalLeavingSensible];
}

// 1.进入悬浮预热器的物质总和
function cal_total_massStream_enteringNode(
    hourlyRawMaterial,
    hourlyClinkerProduction,
    hourlyAirVolume,
    hourlyWasterGasVolume,
    ashConcentration,
){
    let rawMaterialMassStream = cal_rawMaterial_massStream_enteringNode(hourlyRawMaterial, hourlyClinkerProduction)
    let airMassStream = cal_air_massStream_enteringNode(hourlyAirVolume, hourlyClinkerProduction)
    let wasterGasMassStream = cal_wasterGas_massStream_enteringNode(hourlyWasterGasVolume, hourlyClinkerProduction)
    let ashMassStream = cal_Ash_massStream_enteringNode(ashConcentration, hourlyWasterGasVolume, hourlyClinkerProduction)

    let totalEnteringMassStream = rawMaterialMassStream + ashMassStream + airMassStream + wasterGasMassStream
    return totalEnteringMassStream
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
function cal_Ash_massStream_enteringNode(ashConcentration, hourlyWasterGasVolume, hourlyClinkerProduction){
    let ashMassStream = (ashConcentration * hourlyWasterGasVolume) / hourlyClinkerProduction;
    return ashMassStream;
}

// 2.进入悬浮预热器的能量总和
function cal_total_sensible_enteringNode(
    hourlyAirVolume,
    hourlyClinkerProduction,
    hourlyWasterGasVolume,
    rawMaterialTemperature,
    wasterTemperature,
    rawMaterialWaterContent,
    ashConcentration,
    ashSpecificHeat
){
    let rawMaterialSensible = cal_rawMaterial_sensible_enteringNode(rawMaterialTemperature, rawMaterialWaterContent)
    let airSensible = cal_air_sensible_enteringNode(hourlyAirVolume, hourlyClinkerProduction, rawMaterialTemperature)
    let wasterGasSensible = cal_wasterGas_sensible_enteringNode(hourlyWasterGasVolume, hourlyClinkerProduction, wasterTemperature)
    let ashSensible = cal_Ash_sensible_enteringNode(ashConcentration, hourlyWasterGasVolume, hourlyClinkerProduction, ashSpecificHeat, wasterTemperature)
    let totalEnteringSensible = rawMaterialSensible + airSensible + wasterGasSensible + ashSensible
    return totalEnteringSensible;
}
// 2-1.进入的生料量的显热
function cal_rawMaterial_sensible_enteringNode(rawMaterialTemperature, rawMaterialWaterContent){
    // rawMaterialTemperature : 生料的温度
    let rawMaterialSensible = (0.88 + 2.93e4 * rawMaterialTemperature) + 4.1816 * (rawMaterialWaterContent / (100 - rawMaterialWaterContent));
    return rawMaterialSensible;
}
// 2-2.进入的空气显热（生料代入的空气）
function cal_air_sensible_enteringNode(hourlyAirVolume, hourlyClinkerProduction, rawMaterialTemperature){
    let airSensible = hourlyAirVolume / hourlyClinkerProduction * standardAirSpecificHeat * rawMaterialTemperature;
    return airSensible;
}
// 2-3.来自分解炉的废气显热
function cal_wasterGas_sensible_enteringNode(hourlyWasterGasVolume, hourlyClinkerProduction, wasterTemperature){
    let wasterGasSpecificHeat = (
        (carbonMonoxideVolumeFraction * carbonMonoxideSpecificHeat) +
        (carbonDioxideVolumeFraction * carbonDioxideSpecificHeat) +
        (waterVaporVolumeFraction * waterVaporSpecificHeat) +
        (oxygenVolumeFraction * oxygenSpecificHeat) +
        (nitrogenVolumeFraction * nitrogenSpecificHeat) +
        (liquidWaterVolumeFraction * liquidWaterSpecificHeat)) / 100;

    let wasterGasSensible = hourlyWasterGasVolume / hourlyClinkerProduction * wasterGasSpecificHeat * wasterTemperature;
    return wasterGasSensible;
}
// 2-4.来自分解炉的飞灰显热
function cal_Ash_sensible_enteringNode(ashConcentration, hourlyWasterGasVolume, hourlyClinkerProduction, ashSpecificHeat, wasterTemperature){
    let ashMassStream = cal_Ash_massStream_enteringNode(ashConcentration, hourlyWasterGasVolume, hourlyClinkerProduction);
    let ashSensible = ashMassStream * ashSpecificHeat * wasterTemperature;
    return ashSensible
}
// 3.离开悬浮预热器的物质总和
function cal_total_massStream_leavingNode(
    hourlyRawMaterialC5,
    hourlyClinkerProduction,
    hourlyWasterGasVolume,
    ashConcentration,
){
    let rawMaterialMassStream = cal_rawMaterial_massStream_leavingNode(hourlyRawMaterialC5, hourlyClinkerProduction)
    let wasterGasMassStream = cal_wasterGas_massStream_leavingNode(hourlyWasterGasVolume, hourlyClinkerProduction)
    let ashMassStream = cal_ash_massStream_leavingNode(ashConcentration, hourlyWasterGasVolume, hourlyClinkerProduction)

    let totalLeavingMassStream = rawMaterialMassStream + wasterGasMassStream + ashMassStream
    return totalLeavingMassStream;
}
// 3-1.出口的生料
function cal_rawMaterial_massStream_leavingNode(hourlyRawMaterialC5, hourlyClinkerProduction){
    // hourlyRawMaterialC5 : 每小时从C5出口的生料
    let rawMaterialMassStream = hourlyRawMaterialC5 / hourlyClinkerProduction;
    return rawMaterialMassStream;
}
// 3-2.出口的废气
function cal_wasterGas_massStream_leavingNode(hourlyWasterGasVolume, hourlyClinkerProduction){
    let wasterGasMassStream = cal_wasterGas_massStream_enteringNode(hourlyWasterGasVolume, hourlyClinkerProduction);
    return wasterGasMassStream;
}
// 3-3.出口的飞灰
function cal_ash_massStream_leavingNode(ashConcentration, hourlyWasterGasVolume, hourlyClinkerProduction){
    let ashMassStream = cal_Ash_massStream_enteringNode(ashConcentration, hourlyWasterGasVolume, hourlyClinkerProduction);
    return ashMassStream;
}
// 4.离开悬浮预热器的能量总和
function cal_total_sensible_leavingNode(
        hourlyRawMaterialC5,
        hourlyClinkerProduction,
        hourlyWasterGasVolume,
        hourlyRawMaterial,
        rawMaterialSpecificHeatC5,
        rawMaterialTemperatureC5,
        ashConcentration,
        rawMaterialWaterContent,
        averageWasterGasSpecificHeat,
        ashSpecificHeat,
        wasterGasTemperaturePH,
        heatOfVaporization
){
    let rawMaterialSensible = cal_rawMaterial_sensible_leavingNode(hourlyRawMaterialC5, hourlyClinkerProduction, rawMaterialSpecificHeatC5, rawMaterialTemperatureC5);
    let wasterGasSensible = cal_wasterGas_sensible_leavingNode(hourlyWasterGasVolume, hourlyClinkerProduction, averageWasterGasSpecificHeat, wasterGasTemperaturePH);
    let ashSensible = cal_Ash_sensible_leavingNode(ashConcentration, hourlyWasterGasVolume, hourlyClinkerProduction, ashSpecificHeat, wasterGasTemperaturePH);
    let waterVaporSensible = cal_waterVapor_sensible_leavingNode(hourlyRawMaterial, hourlyClinkerProduction, rawMaterialWaterContent, heatOfVaporization);

    let totalLeavingSensible = rawMaterialSensible + wasterGasSensible + ashSensible + waterVaporSensible
    console.log(wasterGasSensible, "TEST")
    return totalLeavingSensible
}
// 4-1. 离开的生料显热
function cal_rawMaterial_sensible_leavingNode(hourlyRawMaterialC5, hourlyClinkerProduction, rawMaterialSpecificHeatC5, rawMaterialTemperatureC5){
    let rawMaterialMassStream = cal_rawMaterial_massStream_leavingNode(hourlyRawMaterialC5, hourlyClinkerProduction);
    let rawMaterialSensible = rawMaterialMassStream * rawMaterialSpecificHeatC5 * rawMaterialTemperatureC5;
    return rawMaterialSensible;
}
// 4-2. 废气
function cal_wasterGas_sensible_leavingNode(hourlyWasterGasVolume, hourlyClinkerProduction, averageWasterGasSpecificHeat, wasterGasTemperaturePH){
    let wasterGasSensible = hourlyWasterGasVolume * averageWasterGasSpecificHeat * wasterGasTemperaturePH / hourlyClinkerProduction;
    return wasterGasSensible;
}
// 4-3. 飞灰
function cal_Ash_sensible_leavingNode(ashConcentration, hourlyWasterGasVolume, hourlyClinkerProduction, ashSpecificHeat, wasterGasTemperaturePH){
    let ashMassStream = cal_Ash_massStream_enteringNode(ashConcentration, hourlyWasterGasVolume, hourlyClinkerProduction);
    let ashSensible = ashMassStream * ashSpecificHeat * wasterGasTemperaturePH;
    return ashSensible;
}
// 4-4. 水蒸气
function cal_waterVapor_sensible_leavingNode(hourlyRawMaterial, hourlyClinkerProduction, rawMaterialWaterContent, heatOfVaporization){
    let rawMaterialMassStream = cal_rawMaterial_massStream_enteringNode(hourlyRawMaterial, hourlyClinkerProduction)
    let waterVaporSensible = rawMaterialMassStream * (rawMaterialWaterContent / 100) * heatOfVaporization
    // heatOfVaporization : 水的气化热
    return waterVaporSensible;
}