// 悬浮预热器的热量收支计算方程流程
// 部分常量定义
// 各个气体的体积分数
// let carbonMonoxideVolumeFraction;
// let carbonDioxideVolumeFraction;
// let waterVaporVolumeFraction = 0.01;
// let oxygenVolumeFraction;
// let nitrogenVolumeFraction;
// const liquidWaterVolumeFraction = 0.1;
// // 各个气体的常压下密度
// const carbonMonoxideDensity = 1.14;
// const carbonDioxideDensity = 1.98;
// const waterVaporDensity = 0.6;
// const oxygenDensity = 1.429;
// const nitrogenDensity = 0.81;
// const standardAirDensity = 1.205; // 标准情况下的空气密度
// 各个气体的比热
// const carbonMonoxideSpecificHeat = 1040;
// const carbonDioxideSpecificHeat = 840;
// const waterVaporSpecificHeat = 1850;
// const oxygenSpecificHeat = 918;
// const nitrogenSpecificHeat = 1040;
// const liquidWaterSpecificHeat = 4200;
// let standardAirSpecificHeat;
// 温度常量
// const waterVaporTemperature = 100;
// 流程执行函数
export function fun2(
	hourlyRawMaterial,
	hourlyAirVolume,
	hourlyWasterGasVolume,
	carbonMonoxideVolumeFraction,
	carbonDioxideVolumeFraction,
	oxygenVolumeFraction,
	nitrogenVolumeFraction,
	ashConcentration,
	rawMaterialTemperature,
	rawMaterialWaterContent,
	ashSpecificHeat,
	hourlyRawMaterialC5,
	rawMaterialTemperatureC5,
	rawMaterialSpecificHeatC5,
	heatOfVaporization,
	standardAirDensity,
	carbonMonoxideDensity, 
    carbonDioxideDensity,
    oxygenDensity,
    nitrogenDensity,
	carbonMonoxideSpecificHeat, 
    carbonDioxideSpecificHeat, 
    oxygenSpecificHeat, 
    nitrogenSpecificHeat,
	standardAirSpecificHeat,
	wasterTemperature,
	wasterGasTemperaturePH,
	hourlyClinkerProduction,
	hourlyWasteGasVolume
){
    let totalEnteringMassStream = cal_total_massStream_enteringNode(hourlyRawMaterial, hourlyClinkerProduction, hourlyAirVolume, hourlyWasterGasVolume, ashConcentration, carbonMonoxideVolumeFraction,carbonDioxideVolumeFraction,oxygenVolumeFraction,nitrogenVolumeFraction, standardAirDensity, carbonMonoxideDensity, carbonDioxideDensity, oxygenDensity, nitrogenDensity)
    let totalEnteringSensible = cal_total_sensible_enteringNode(hourlyAirVolume, hourlyClinkerProduction, hourlyWasterGasVolume, rawMaterialTemperature, wasterTemperature, rawMaterialWaterContent, ashConcentration, ashSpecificHeat, carbonMonoxideVolumeFraction, carbonDioxideVolumeFraction, oxygenVolumeFraction, nitrogenVolumeFraction, standardAirSpecificHeat, hourlyRawMaterial, carbonMonoxideSpecificHeat, carbonDioxideSpecificHeat, oxygenSpecificHeat, nitrogenSpecificHeat)
    let totalLeavingMassStream = cal_total_massStream_leavingNode(hourlyRawMaterialC5, hourlyClinkerProduction, hourlyWasterGasVolume, ashConcentration, carbonMonoxideVolumeFraction,carbonDioxideVolumeFraction,oxygenVolumeFraction,nitrogenVolumeFraction, carbonMonoxideDensity, carbonDioxideDensity, oxygenDensity, nitrogenDensity)
    let totalLeavingSensible = cal_total_sensible_leavingNode(hourlyRawMaterialC5, hourlyClinkerProduction, hourlyWasterGasVolume, hourlyRawMaterial, rawMaterialSpecificHeatC5, rawMaterialTemperatureC5, ashConcentration, rawMaterialWaterContent, ashSpecificHeat, wasterGasTemperaturePH, heatOfVaporization, hourlyWasteGasVolume, carbonDioxideVolumeFraction, carbonMonoxideVolumeFraction, oxygenVolumeFraction, nitrogenVolumeFraction, carbonDioxideSpecificHeat, carbonMonoxideSpecificHeat, oxygenSpecificHeat, nitrogenSpecificHeat)

    // 可计算物质流损失比和热效率
    let massStreamRatio = totalLeavingMassStream / totalEnteringMassStream * 100;
    let thermalEfficiency = totalLeavingSensible / totalEnteringSensible * 100;

    return [massStreamRatio, thermalEfficiency, totalEnteringMassStream, totalEnteringSensible, totalLeavingMassStream, totalLeavingSensible];
    //return [totalEnteringMassStream,totalEnteringSensible,totalLeavingMassStream,totalLeavingSensible];
}

// 1.进入悬浮预热器的物质总和
function cal_total_massStream_enteringNode(
    hourlyRawMaterial,
    hourlyClinkerProduction,
    hourlyAirVolume,
    hourlyWasterGasVolume,
    ashConcentration,
	carbonMonoxideVolumeFraction,
	carbonDioxideVolumeFraction,
	oxygenVolumeFraction,
	nitrogenVolumeFraction,
	standardAirDensity,
	carbonMonoxideDensity, carbonDioxideDensity, oxygenDensity, nitrogenDensity
){
    let rawMaterialMassStream = cal_rawMaterial_massStream_enteringNode(hourlyRawMaterial, hourlyClinkerProduction)
    let airMassStream = cal_air_massStream_enteringNode(hourlyAirVolume, hourlyClinkerProduction, standardAirDensity)
    let wasterGasMassStream = cal_wasterGas_massStream_enteringNode(hourlyWasterGasVolume, hourlyClinkerProduction, carbonMonoxideVolumeFraction, carbonDioxideVolumeFraction, oxygenVolumeFraction, nitrogenVolumeFraction, carbonMonoxideDensity, carbonDioxideDensity, oxygenDensity, nitrogenDensity)
    let ashMassStream = cal_Ash_massStream_enteringNode(ashConcentration, hourlyWasterGasVolume, hourlyClinkerProduction)

    let totalEnteringMassStream = rawMaterialMassStream + ashMassStream + airMassStream + wasterGasMassStream
    return totalEnteringMassStream
}
// (success)1-1.进入的生料量
function cal_rawMaterial_massStream_enteringNode(hourlyRawMaterial, hourlyClinkerProduction){
    let rawMaterialMassStream = hourlyRawMaterial / hourlyClinkerProduction;
    return rawMaterialMassStream;
}
// (success)1-2.进入的空气（生料代入的空气）
function cal_air_massStream_enteringNode(hourlyAirVolume, hourlyClinkerProduction, standardAirDensity){
    let airMassStream = hourlyAirVolume * standardAirDensity / hourlyClinkerProduction;
    return airMassStream;
}
// (success)1-3.来自分解炉的废气
function cal_wasterGas_massStream_enteringNode(hourlyWasterGasVolume, hourlyClinkerProduction, carbonMonoxideVolumeFraction, carbonDioxideVolumeFraction, oxygenVolumeFraction, nitrogenVolumeFraction, carbonMonoxideDensity, carbonDioxideDensity, oxygenDensity, nitrogenDensity){
    let wasterGasDensity = (
        carbonMonoxideDensity * carbonMonoxideVolumeFraction +
        carbonDioxideDensity * carbonDioxideVolumeFraction+
        oxygenDensity * oxygenVolumeFraction +
        nitrogenDensity * nitrogenVolumeFraction) / 100;

    let wasterGasMassStream = (hourlyWasterGasVolume * wasterGasDensity) / hourlyClinkerProduction;
    return wasterGasMassStream;
}
// (success)1-4.来自分解炉的飞灰
function cal_Ash_massStream_enteringNode(ashConcentration, hourlyWasterGasVolume, hourlyClinkerProduction){
    let ashMassStream = (ashConcentration * hourlyWasterGasVolume) / hourlyClinkerProduction;
    return ashMassStream;
}

// 2.进入悬浮预热器的能量总和
function cal_total_sensible_enteringNode(hourlyAirVolume, hourlyClinkerProduction, hourlyWasterGasVolume, rawMaterialTemperature, wasterTemperature, rawMaterialWaterContent, ashConcentration, ashSpecificHeat, carbonMonoxideVolumeFraction, carbonDioxideVolumeFraction, oxygenVolumeFraction, nitrogenVolumeFraction, standardAirSpecificHeat, hourlyRawMaterial, carbonMonoxideSpecificHeat, carbonDioxideSpecificHeat, oxygenSpecificHeat, nitrogenSpecificHeat){
    let rawMaterialSensible = cal_rawMaterial_sensible_enteringNode(hourlyRawMaterial, hourlyClinkerProduction, rawMaterialTemperature, rawMaterialWaterContent)
    let airSensible = cal_air_sensible_enteringNode(hourlyAirVolume, hourlyClinkerProduction, rawMaterialTemperature, standardAirSpecificHeat)
    let wasterGasSensible = cal_wasterGas_sensible_enteringNode(hourlyWasterGasVolume, hourlyClinkerProduction, wasterTemperature, carbonMonoxideVolumeFraction,carbonDioxideVolumeFraction,oxygenVolumeFraction,nitrogenVolumeFraction, carbonMonoxideSpecificHeat, carbonDioxideSpecificHeat, oxygenSpecificHeat, nitrogenSpecificHeat)
    let ashSensible = cal_Ash_sensible_enteringNode(ashConcentration, hourlyWasterGasVolume, hourlyClinkerProduction, ashSpecificHeat, wasterTemperature)
    let totalEnteringSensible = rawMaterialSensible + airSensible + wasterGasSensible + ashSensible
    return totalEnteringSensible;
}
// (success)2-1.进入的生料量的显热
function cal_rawMaterial_sensible_enteringNode(hourlyRawMaterial, hourlyClinkerProduction, rawMaterialTemperature, rawMaterialWaterContent){
    // rawMaterialTemperature : 生料的温度
	let rawMaterialMassStream = cal_rawMaterial_massStream_enteringNode(hourlyRawMaterial, hourlyClinkerProduction)
    let rawMaterialMassStreamSpecificHeat = (0.88 + 2.93e4 * rawMaterialTemperature) + 4.1816 * (rawMaterialWaterContent / (100 - rawMaterialWaterContent));
	let rawMaterialSensible = rawMaterialMassStream * rawMaterialMassStreamSpecificHeat * rawMaterialTemperature
    return rawMaterialSensible;
}
// (success)2-2. 进入的空气显热（生料代入的空气）
function cal_air_sensible_enteringNode(hourlyAirVolume, hourlyClinkerProduction, rawMaterialTemperature, standardAirSpecificHeat){
    let airSensible = hourlyAirVolume / hourlyClinkerProduction * standardAirSpecificHeat * rawMaterialTemperature;
    return airSensible;
}
// (success)2-3.来自分解炉的废气显热
function cal_wasterGas_sensible_enteringNode(hourlyWasterGasVolume, hourlyClinkerProduction, wasterTemperature, carbonMonoxideVolumeFraction,carbonDioxideVolumeFraction,oxygenVolumeFraction,nitrogenVolumeFraction, carbonMonoxideSpecificHeat, carbonDioxideSpecificHeat, oxygenSpecificHeat, nitrogenSpecificHeat){
    let wasterGasSpecificHeat = (
        (carbonMonoxideVolumeFraction * carbonMonoxideSpecificHeat) +
        (carbonDioxideVolumeFraction * carbonDioxideSpecificHeat) +
        (oxygenVolumeFraction * oxygenSpecificHeat) +
        (nitrogenVolumeFraction * nitrogenSpecificHeat)) / 100;

    let wasterGasSensible = hourlyWasterGasVolume / hourlyClinkerProduction * wasterGasSpecificHeat * wasterTemperature;
    return wasterGasSensible;
}
// （success）2-4.来自分解炉的飞灰显热
function cal_Ash_sensible_enteringNode(ashConcentration, hourlyWasterGasVolume, hourlyClinkerProduction, ashSpecificHeat, wasterTemperature){
    let ashMassStream = cal_Ash_massStream_enteringNode(ashConcentration, hourlyWasterGasVolume, hourlyClinkerProduction);
    let ashSensible = ashMassStream * ashSpecificHeat * wasterTemperature;
    return ashSensible
}
// 3.离开悬浮预热器的物质总和
function cal_total_massStream_leavingNode(hourlyRawMaterialC5, hourlyClinkerProduction, hourlyWasterGasVolume, ashConcentration, carbonMonoxideVolumeFraction,carbonDioxideVolumeFraction,oxygenVolumeFraction,nitrogenVolumeFraction, carbonMonoxideDensity, carbonDioxideDensity, oxygenDensity, nitrogenDensity){
    let rawMaterialMassStream = cal_rawMaterial_massStream_leavingNode(hourlyRawMaterialC5, hourlyClinkerProduction)
    let wasterGasMassStream = cal_wasterGas_massStream_leavingNode(hourlyWasterGasVolume, hourlyClinkerProduction, carbonMonoxideVolumeFraction,carbonDioxideVolumeFraction,oxygenVolumeFraction,nitrogenVolumeFraction, carbonMonoxideDensity, carbonDioxideDensity, oxygenDensity, nitrogenDensity)
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
// (success)3-2.出口的废气
function cal_wasterGas_massStream_leavingNode(hourlyWasterGasVolume, hourlyClinkerProduction, carbonMonoxideVolumeFraction,carbonDioxideVolumeFraction,oxygenVolumeFraction,nitrogenVolumeFraction, carbonMonoxideDensity, carbonDioxideDensity, oxygenDensity, nitrogenDensity){
    let wasterGasMassStream = cal_wasterGas_massStream_enteringNode(hourlyWasterGasVolume, hourlyClinkerProduction, carbonMonoxideVolumeFraction, carbonDioxideVolumeFraction, oxygenVolumeFraction, nitrogenVolumeFraction, carbonMonoxideDensity, carbonDioxideDensity, oxygenDensity, nitrogenDensity)
    return wasterGasMassStream;
}
// (success)3-3.出口的飞灰
function cal_ash_massStream_leavingNode(ashConcentration, hourlyWasterGasVolume, hourlyClinkerProduction){
    let ashMassStream = cal_Ash_massStream_enteringNode(ashConcentration, hourlyWasterGasVolume, hourlyClinkerProduction);
    return ashMassStream;
}
// 4.离开悬浮预热器的能量总和
function cal_total_sensible_leavingNode(hourlyRawMaterialC5, hourlyClinkerProduction, hourlyWasterGasVolume, hourlyRawMaterial, rawMaterialSpecificHeatC5, rawMaterialTemperatureC5, ashConcentration, rawMaterialWaterContent, ashSpecificHeat, wasterGasTemperaturePH, heatOfVaporization, hourlyWasteGasVolume, carbonDioxideVolumeFraction, carbonMonoxideVolumeFraction, oxygenVolumeFraction, nitrogenVolumeFraction, carbonDioxideSpecificHeat, carbonMonoxideSpecificHeat, oxygenSpecificHeat, nitrogenSpecificHeat){
    let rawMaterialSensible = cal_rawMaterial_sensible_leavingNode(hourlyRawMaterialC5, hourlyClinkerProduction, rawMaterialSpecificHeatC5, rawMaterialTemperatureC5);
    let wasterGasSensible = cal_wasterGas_sensible_leavingNode(hourlyWasteGasVolume, hourlyClinkerProduction, wasterGasTemperaturePH, carbonDioxideVolumeFraction, carbonMonoxideVolumeFraction, oxygenVolumeFraction, nitrogenVolumeFraction, carbonDioxideSpecificHeat, carbonMonoxideSpecificHeat, oxygenSpecificHeat, nitrogenSpecificHeat)
    let ashSensible = cal_Ash_sensible_leavingNode(ashConcentration, hourlyWasteGasVolume, hourlyClinkerProduction, ashSpecificHeat, wasterGasTemperaturePH);
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
// (success)4-2. 废气
function cal_wasterGas_sensible_leavingNode(hourlyWasteGasVolume, hourlyClinkerProduction, wasterGasTemperaturePH, carbonDioxideVolumeFraction, carbonMonoxideVolumeFraction, oxygenVolumeFraction, nitrogenVolumeFraction, carbonDioxideSpecificHeat, carbonMonoxideSpecificHeat, oxygenSpecificHeat, nitrogenSpecificHeat){
    let wasterGasSensible;
	let wasterGasSpecificHeat = (
		(carbonMonoxideSpecificHeat * carbonMonoxideVolumeFraction) +
		(carbonDioxideSpecificHeat * carbonDioxideVolumeFraction) +
		(oxygenSpecificHeat * oxygenVolumeFraction) +
		(nitrogenSpecificHeat * nitrogenVolumeFraction)
	) / 100;
    wasterGasSensible = hourlyWasteGasVolume * wasterGasSpecificHeat * wasterGasTemperaturePH / hourlyClinkerProduction;
    return wasterGasSensible;
}
// (success)4-3. 飞灰
function cal_Ash_sensible_leavingNode(ashConcentration, hourlyWasteGasVolume, hourlyClinkerProduction, ashSpecificHeat, wasterGasTemperaturePH){
    let ashMassStream = cal_Ash_massStream_enteringNode(ashConcentration, hourlyWasteGasVolume, hourlyClinkerProduction);
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