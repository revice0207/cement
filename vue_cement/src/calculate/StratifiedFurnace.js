// 分解炉的热量收支计算方程流程
// 部分常量定义
//////////////////////////////////////////////////////////////////////////////////////////////
// 各个一次空气的体积分数
// const carbonMonoxideVolumeFractionFirst = 0.1;
// const carbonDioxideVolumeFractionFirst = 0.1;
// const waterVaporVolumeFractionFirst = 0.1;
// const oxygenVolumeFractionFirst = 0.2;
// const nitrogenVolumeFractionFirst = 0.2;
// 各个三次空气的体积分数
// const carbonMonoxideVolumeFractionThird = 0.1;
// const carbonDioxideVolumeFractionThird = 0.1;
// const waterVaporVolumeFractionThird = 0.1;
// const oxygenVolumeFractionThird = 0.2;
// const nitrogenVolumeFractionThird = 0.2;
// 窑尾废气
// const carbonMonoxideVolumeFractionWasterGas = 0.1;
// const carbonDioxideVolumeFractionWasterGas = 0.1;
// const waterVaporVolumeFractionWasterGas = 0.1;
// const oxygenVolumeFractionWasterGas = 0.2;
// const nitrogenVolumeFractionWasterGas = 0.2;
//////////////////////////////////////////////////////////////////////////////////////////////
// 各个气体的常压下密度
// const carbonMonoxideDensity = 1.14;
// const carbonDioxideDensity = 1.98;
// const waterVaporDensity = 0.6;
// const oxygenDensity = 1.429;
// const nitrogenDensity = 0.81;
const standardAirDensity = 1.293; // 标准情况下的空气密度
//---------------------------------------------------------------------------------------------
const standardAirSpecificHeat = 1009;
// 各个一次空气的比热
// const carbonMonoxideSpecificHeatFirst = 1040;
// const carbonDioxideSpecificHeatFirst = 840;
// const waterVaporSpecificHeatFirst = 1850;
// const oxygenSpecificHeatFirst = 918;
// const nitrogenSpecificHeatFirst = 1040;
// 各个三次空气的比热
// const carbonMonoxideSpecificHeatThird = 1040;
// const carbonDioxideSpecificHeatThird = 840;
// const waterVaporSpecificHeatThird = 1850;
// const oxygenSpecificHeatThird = 918;
// const nitrogenSpecificHeatThird = 1040;
// 窑尾废气的比热
// const carbonMonoxideSpecificHeatWasterGas = 1040;
// const carbonDioxideSpecificHeatWasterGas = 840;
// const waterVaporSpecificHeatWasterGas = 1850;
// const oxygenSpecificHeatWasterGas = 918;
// const nitrogenSpecificHeatWasterGas = 1040;

// const coalPowderSpecificHeat = 1000;
// const ashSpecificHeat = 1200;
// const rawMaterialSpecificHeat = 100;
//---------------------------------------------------------------------------------------------
// 流程执行函数

// 1.进入节点的物质流总量
export function fun3(
    hourlyCoalPowder, 
	hourlySendCoalAirVolume,
	hourlyThirdAirVolume,
	carbonMonoxideVolumeFractionThird,
	carbonDioxideVolumeFractionThird, 
	oxygenVolumeFractionThird, 
	nitrogenVolumeFractionThird,
	ThirdAirDustContent,
	hourlyLeakageVolume,
	hourlyWasterGasVolume,
	carbonMonoxideVolumeFractionWasterGas,
	carbonDioxideVolumeFractionWasterGas, 
	oxygenVolumeFractionWasterGas, 
	nitrogenVolumeFractionWasterGas,
	ashContent,
	coalPowderTemperature,
	thirdAirTemperature,
	airTemperature,
	coalHeatingValue,
	wasterGasTemperature,
	hourlyRawMaterial, 
	rawMaterialTemperature,
	ashLoss,
	rawMaterialLoss, 
	rawMaterialWaterContent, 
	magnesiumOxideContent, 
	calciumOxideContent,
	coalPowderSpecificHeat,
	carbonMonoxideDensityThird, 
	carbonDioxideDensityThird, 
	oxygenDensityThird, 
	nitrogenDensityThird,	
	carbonMonoxideSpecificHeatThird,
	carbonDioxideSpecificHeatThird, 
	oxygenSpecificHeatThird, 
	nitrogenSpecificHeatThird,
	carbonMonoxideDensityWasterGas,
	carbonDioxideDensityWasterGas, 
	oxygenDensityWasterGas, 
	nitrogenDensityWasterGas, 
	carbonMonoxideSpecificHeatWasterGas,
	carbonDioxideSpecificHeatWasterGas, 
	oxygenSpecificHeatWasterGas, 
	nitrogenSpecificHeatWasterGas, 
	ashSpecificHeat,
	rawMaterialSpecificHeat,
	hourlyClinkerProduction, 
	ashDensity, 
	hourlyOthersMass,
	sendCoalAirTemperature, 
	clinkerSpecificHeat, 
	othersSpecificHeat, 
	othersTemperature, 
	othersHeatingValue,
	hourlyLeavingCoalPowder,
){
    let totalEnteringMassStream = cal_total_massStream_enteringNode(hourlyCoalPowder, hourlyClinkerProduction, hourlySendCoalAirVolume, hourlyThirdAirVolume, hourlyRawMaterial, hourlyLeakageVolume, hourlyWasterGasVolume, ashDensity, ThirdAirDustContent, carbonMonoxideDensityThird, carbonDioxideDensityThird, oxygenDensityThird, nitrogenDensityThird, carbonMonoxideVolumeFractionThird, carbonDioxideVolumeFractionThird, oxygenVolumeFractionThird, nitrogenVolumeFractionThird, carbonMonoxideDensityWasterGas, carbonDioxideDensityWasterGas, oxygenDensityWasterGas, nitrogenDensityWasterGas, carbonMonoxideVolumeFractionWasterGas, carbonDioxideVolumeFractionWasterGas, oxygenVolumeFractionWasterGas, nitrogenVolumeFractionWasterGas, ashContent, hourlyOthersMass);
    let totalEnteringSensible = cal_total_sensible_enteringNode(hourlyCoalPowder, hourlyClinkerProduction, coalPowderTemperature, coalPowderSpecificHeat, hourlySendCoalAirVolume, sendCoalAirTemperature, hourlyThirdAirVolume, thirdAirTemperature, carbonMonoxideVolumeFractionThird, carbonDioxideVolumeFractionThird, oxygenVolumeFractionThird, nitrogenVolumeFractionThird, carbonMonoxideSpecificHeatThird, carbonDioxideSpecificHeatThird, oxygenSpecificHeatThird, nitrogenSpecificHeatThird, clinkerSpecificHeat, hourlyRawMaterial, rawMaterialTemperature, rawMaterialWaterContent, hourlyLeakageVolume, airTemperature, coalHeatingValue, hourlyWasterGasVolume, wasterGasTemperature, carbonMonoxideVolumeFractionWasterGas, carbonDioxideVolumeFractionWasterGas, oxygenVolumeFractionWasterGas, nitrogenVolumeFractionWasterGas, carbonMonoxideSpecificHeatWasterGas, carbonDioxideSpecificHeatWasterGas, oxygenSpecificHeatWasterGas, nitrogenSpecificHeatWasterGas, ashDensity, ashContent, ashSpecificHeat, hourlyOthersMass, othersSpecificHeat, othersTemperature, othersHeatingValue, ThirdAirDustContent)
    let totalLeavingMassStream = cal_total_massStream_leavingNode(hourlyLeavingCoalPowder, hourlyClinkerProduction, hourlyWasterGasVolume, carbonMonoxideDensityWasterGas, carbonDioxideDensityWasterGas, oxygenDensityWasterGas, nitrogenDensityWasterGas, carbonMonoxideVolumeFractionWasterGas, carbonDioxideVolumeFractionWasterGas, oxygenVolumeFractionWasterGas, nitrogenVolumeFractionWasterGas, ashContent)
    let totalLeavingSensible = cal_total_energyStream_leavingNode(hourlyRawMaterial, hourlyClinkerProduction, rawMaterialSpecificHeat, rawMaterialTemperature, hourlyWasterGasVolume, wasterGasTemperature, carbonMonoxideVolumeFractionWasterGas, carbonDioxideVolumeFractionWasterGas, oxygenVolumeFractionWasterGas, nitrogenVolumeFractionWasterGas, carbonMonoxideSpecificHeatWasterGas, carbonDioxideSpecificHeatWasterGas, oxygenSpecificHeatWasterGas, nitrogenSpecificHeatWasterGas, ashDensity, ashContent, ashSpecificHeat, ashLoss, rawMaterialLoss, rawMaterialWaterContent, magnesiumOxideContent, calciumOxideContent, hourlyCoalPowder)

    // 可计算物质流损失比和热效率
    let massStreamRatio = totalLeavingMassStream / totalEnteringMassStream * 100;
    let thermalEfficiency = totalLeavingSensible / totalEnteringSensible * 100;

    return [massStreamRatio, thermalEfficiency, totalEnteringMassStream, totalEnteringSensible, totalLeavingMassStream, totalLeavingSensible];
}
// (success)1
function cal_total_massStream_enteringNode(hourlyCoalPowder, hourlyClinkerProduction, hourlySendCoalAirVolume, hourlyThirdAirVolume, hourlyRawMaterial, hourlyLeakageVolume, hourlyWasterGasVolume, ashDensity, ThirdAirDustContent, carbonMonoxideDensityThird, carbonDioxideDensityThird, oxygenDensityThird, nitrogenDensityThird, carbonMonoxideVolumeFractionThird, carbonDioxideVolumeFractionThird, oxygenVolumeFractionThird, nitrogenVolumeFractionThird, carbonMonoxideDensityWasterGas, carbonDioxideDensityWasterGas, oxygenDensityWasterGas, nitrogenDensityWasterGas, carbonMonoxideVolumeFractionWasterGas, carbonDioxideVolumeFractionWasterGas, oxygenVolumeFractionWasterGas, nitrogenVolumeFractionWasterGas, ashContent, hourlyOthersMass){
    let coalPowderMassStream = cal_coalPowder_massStream_enteringNode(hourlyCoalPowder, hourlyClinkerProduction)
    let sendCoalAirMassStream = cal_sendCoalAir_massStream_enteringNode(hourlySendCoalAirVolume, hourlyClinkerProduction)
    let thirdAirMassStream = cal_thirdAir_massStream_enteringNode(hourlyThirdAirVolume, hourlyClinkerProduction, ThirdAirDustContent, carbonMonoxideDensityThird, carbonDioxideDensityThird, oxygenDensityThird, nitrogenDensityThird, carbonMonoxideVolumeFractionThird, carbonDioxideVolumeFractionThird, oxygenVolumeFractionThird, nitrogenVolumeFractionThird)
    let rawMaterialMassStream = cal_rawMaterial_massStream_enteringNode(hourlyRawMaterial, hourlyClinkerProduction)
    let leakageMassStream = cal_leakage_massStream_enteringNode(hourlyLeakageVolume, hourlyClinkerProduction)
    let wasterGasMassStream = cal_wasterGas_massStream_enteringNode(hourlyWasterGasVolume, hourlyClinkerProduction, carbonMonoxideDensityWasterGas, carbonDioxideDensityWasterGas, oxygenDensityWasterGas, nitrogenDensityWasterGas, carbonMonoxideVolumeFractionWasterGas, carbonDioxideVolumeFractionWasterGas, oxygenVolumeFractionWasterGas, nitrogenVolumeFractionWasterGas)
    let ashMassStream = cal_ash_massStream_enteringNode(hourlyWasterGasVolume, hourlyClinkerProduction, ashContent)
	let othersMassStream = cal_others_massStream_enteringNode(hourlyOthersMass, hourlyClinkerProduction);

    let totalEnteringNodeMassStream = coalPowderMassStream + sendCoalAirMassStream + thirdAirMassStream + rawMaterialMassStream + leakageMassStream + wasterGasMassStream + ashMassStream + othersMassStream;
    return totalEnteringNodeMassStream;
}
// (success)1-1:煤粉进入的物质流
function cal_coalPowder_massStream_enteringNode(hourlyCoalPowder, hourlyClinkerProduction){
    let coalPowderMassStream = hourlyCoalPowder / hourlyClinkerProduction;
    return coalPowderMassStream;
}
// (success)1-2:一次空气的物质流
function cal_sendCoalAir_massStream_enteringNode(hourlySendCoalAirVolume, hourlyClinkerProduction){
    let sendCoalAirMassStream = hourlySendCoalAirVolume * standardAirDensity / hourlyClinkerProduction;
    return sendCoalAirMassStream;
}
// (success)1-3:三次空气的物质流
function cal_thirdAir_massStream_enteringNode(hourlyThirdAirVolume, hourlyClinkerProduction, ThirdAirDustContent, carbonMonoxideDensityThird, carbonDioxideDensityThird, oxygenDensityThird, nitrogenDensityThird, carbonMonoxideVolumeFractionThird, carbonDioxideVolumeFractionThird, oxygenVolumeFractionThird, nitrogenVolumeFractionThird){
    let thirdAirDensity = (
        carbonMonoxideDensityThird * carbonMonoxideVolumeFractionThird +
        carbonDioxideDensityThird * carbonDioxideVolumeFractionThird+
        oxygenDensityThird * oxygenVolumeFractionThird +
        nitrogenDensityThird * nitrogenVolumeFractionThird) / 100;
	let DustMassStream = hourlyThirdAirVolume * ThirdAirDustContent / hourlyClinkerProduction
    let thirdAirMassStream = (hourlyThirdAirVolume * thirdAirDensity / hourlyClinkerProduction) + DustMassStream;
    return thirdAirMassStream;
}
// (success)1-4:出口生料的物质流
function cal_rawMaterial_massStream_enteringNode(hourlyRawMaterial, hourlyClinkerProduction){
    let rawMaterialMassStream = hourlyRawMaterial / hourlyClinkerProduction;
    return rawMaterialMassStream;
}
// (success)1-5:漏风的物质流
function cal_leakage_massStream_enteringNode(hourlyLeakageVolume, hourlyClinkerProduction){
    // 使用标准空气的密度
    let leakageMassStream = hourlyLeakageVolume * standardAirDensity / hourlyClinkerProduction;
    return leakageMassStream;
}
// (success)1-6:窑尾的废气的物质流
function cal_wasterGas_massStream_enteringNode(hourlyWasterGasVolume, hourlyClinkerProduction, carbonMonoxideDensityWasterGas, carbonDioxideDensityWasterGas, oxygenDensityWasterGas, nitrogenDensityWasterGas, carbonMonoxideVolumeFractionWasterGas, carbonDioxideVolumeFractionWasterGas, oxygenVolumeFractionWasterGas, nitrogenVolumeFractionWasterGas){
    let wasterGasDensity = (
        carbonMonoxideDensityWasterGas * carbonMonoxideVolumeFractionWasterGas +
        carbonDioxideDensityWasterGas * carbonDioxideVolumeFractionWasterGas+
        oxygenDensityWasterGas * oxygenVolumeFractionWasterGas +
        nitrogenDensityWasterGas * nitrogenVolumeFractionWasterGas) / 100;

    let wasterGasMassStream = hourlyWasterGasVolume * wasterGasDensity / hourlyClinkerProduction;
    return wasterGasMassStream
}
// (success)1-7:窑尾的飞灰的物质流
function cal_ash_massStream_enteringNode(hourlyWasterGasVolume, hourlyClinkerProduction, ashContent){
    let ashMassStream = hourlyWasterGasVolume * ashContent / hourlyClinkerProduction;
    return ashMassStream;
}
// (success)1-8:其他燃料
function cal_others_massStream_enteringNode(hourlyOthersMass, hourlyClinkerProduction){
	let othersMassStream = hourlyOthersMass / hourlyClinkerProduction;
	return othersMassStream;
}
// 2.进入冷却炉的能量流
function cal_total_sensible_enteringNode(hourlyCoalPowder, hourlyClinkerProduction, coalPowderTemperature, coalPowderSpecificHeat, hourlySendCoalAirVolume, sendCoalAirTemperature, hourlyThirdAirVolume, thirdAirTemperature, carbonMonoxideVolumeFractionThird, carbonDioxideVolumeFractionThird, oxygenVolumeFractionThird, nitrogenVolumeFractionThird, carbonMonoxideSpecificHeatThird, carbonDioxideSpecificHeatThird, oxygenSpecificHeatThird, nitrogenSpecificHeatThird, clinkerSpecificHeat, hourlyRawMaterial, rawMaterialTemperature, rawMaterialWaterContent, hourlyLeakageVolume, airTemperature, coalHeatingValue, hourlyWasterGasVolume, wasterGasTemperature, carbonMonoxideVolumeFractionWasterGas, carbonDioxideVolumeFractionWasterGas, oxygenVolumeFractionWasterGas, nitrogenVolumeFractionWasterGas, carbonMonoxideSpecificHeatWasterGas, carbonDioxideSpecificHeatWasterGas, oxygenSpecificHeatWasterGas, nitrogenSpecificHeatWasterGas, ashDensity, ashContent, ashSpecificHeat, hourlyOthersMass, othersSpecificHeat, othersTemperature, othersHeatingValue, ThirdAirDustContent){
    let coalPowderSensible = cal_coalPowder_sensible_enteringNode(hourlyCoalPowder, hourlyClinkerProduction, coalPowderTemperature, coalPowderSpecificHeat);
    let sendCoalAirSensible = cal_sendCoalAir_sensible_enteringNode(hourlySendCoalAirVolume, hourlyClinkerProduction, sendCoalAirTemperature)
    let thirdAirSensible = cal_thirdAir_sensible_enteringNode(hourlyThirdAirVolume, hourlyClinkerProduction, thirdAirTemperature, carbonMonoxideVolumeFractionThird, carbonDioxideVolumeFractionThird, oxygenVolumeFractionThird, nitrogenVolumeFractionThird, carbonMonoxideSpecificHeatThird, carbonDioxideSpecificHeatThird, oxygenSpecificHeatThird, nitrogenSpecificHeatThird, clinkerSpecificHeat, ThirdAirDustContent);
    let rawMaterialSensible = cal_rawMaterial_sensible_enteringNode(hourlyRawMaterial, hourlyClinkerProduction, rawMaterialTemperature, rawMaterialWaterContent);
    let leakageSensible = cal_leakage_sensible_enteringNode(hourlyLeakageVolume, hourlyClinkerProduction, airTemperature)
    let coalPowderBurningSensible = cal_coalPowderBurning_sensible_enteringNode(hourlyCoalPowder, hourlyClinkerProduction, coalHeatingValue)
    let wasterGasSensible = cal_wasterGas_sensible_enteringNode(hourlyWasterGasVolume, hourlyClinkerProduction, wasterGasTemperature, carbonMonoxideVolumeFractionWasterGas, carbonDioxideVolumeFractionWasterGas, oxygenVolumeFractionWasterGas, nitrogenVolumeFractionWasterGas, carbonMonoxideSpecificHeatWasterGas, carbonDioxideSpecificHeatWasterGas, oxygenSpecificHeatWasterGas, nitrogenSpecificHeatWasterGas)
    let ashSensible = cal_ash_sensible_enteringNode(hourlyWasterGasVolume, hourlyClinkerProduction, ashDensity, ashContent, ashSpecificHeat, wasterGasTemperature)
	let othersSensible = cal_others_sensible_enteringNode(hourlyOthersMass, hourlyClinkerProduction, othersSpecificHeat, othersTemperature)
	let othersBurningSebsible = cal_othersBurning_sensible_enteringNode(hourlyOthersMass, hourlyClinkerProduction, othersHeatingValue)
	
    let totalEnteringNodeSensible = coalPowderSensible + sendCoalAirSensible + thirdAirSensible + rawMaterialSensible + leakageSensible + coalPowderBurningSensible + wasterGasSensible + ashSensible + othersSensible + othersBurningSebsible
    return totalEnteringNodeSensible;
}
// (success)2-1
function cal_coalPowder_sensible_enteringNode(hourlyCoalPowder, hourlyClinkerProduction, coalPowderTemperature, coalPowderSpecificHeat){
    let coalPowderMassStream = cal_coalPowder_massStream_enteringNode(hourlyCoalPowder, hourlyClinkerProduction);
    let coalPowderSensible = coalPowderMassStream * coalPowderSpecificHeat * coalPowderTemperature;
    return coalPowderSensible;
}
// (success)2-2：送煤空气
function cal_sendCoalAir_sensible_enteringNode(hourlySendCoalAirVolume, hourlyClinkerProduction, sendCoalAirTemperature){
    let sendCoalAirSensible = hourlySendCoalAirVolume * standardAirSpecificHeat * sendCoalAirTemperature / hourlyClinkerProduction;
    return sendCoalAirSensible;
}
// (success)2-3: 三次空气显热
function cal_thirdAir_sensible_enteringNode(hourlyThirdAirVolume, hourlyClinkerProduction, thirdAirTemperature, carbonMonoxideVolumeFractionThird, carbonDioxideVolumeFractionThird, oxygenVolumeFractionThird, nitrogenVolumeFractionThird, carbonMonoxideSpecificHeatThird, carbonDioxideSpecificHeatThird, oxygenSpecificHeatThird, nitrogenSpecificHeatThird, clinkerSpecificHeat, ThirdAirDustContent){
    let thirdAirSpecificHeat = (
        (carbonMonoxideVolumeFractionThird * carbonMonoxideSpecificHeatThird) +
        (carbonDioxideVolumeFractionThird * carbonDioxideSpecificHeatThird) +
        (oxygenVolumeFractionThird * oxygenSpecificHeatThird) +
        (nitrogenVolumeFractionThird * nitrogenSpecificHeatThird)) / 100;
	let DustMassStream = hourlyThirdAirVolume * ThirdAirDustContent / hourlyClinkerProduction;
    let thirdAirSensible = (hourlyThirdAirVolume * thirdAirSpecificHeat * thirdAirTemperature / hourlyClinkerProduction) + (DustMassStream * thirdAirTemperature * clinkerSpecificHeat);
    return thirdAirSensible;
}
// (success)2-4
function cal_rawMaterial_sensible_enteringNode(hourlyRawMaterial, hourlyClinkerProduction, rawMaterialTemperature, rawMaterialWaterContent){
    // rawMaterialTemperature : 生料的温度
	let rawMaterialMassStream = cal_rawMaterial_massStream_enteringNode(hourlyRawMaterial, hourlyClinkerProduction)
    let rawMaterialMassStreamSpecificHeat = (0.88 + 2.93e4 * rawMaterialTemperature) + 4.1816 * (rawMaterialWaterContent / (100 - rawMaterialWaterContent));
	let rawMaterialSensible = rawMaterialMassStream * rawMaterialMassStreamSpecificHeat * rawMaterialTemperature
    return rawMaterialSensible;
}
// (success)2-5:漏风显热
function cal_leakage_sensible_enteringNode(hourlyLeakageVolume, hourlyClinkerProduction, airTemperature){
    let leakageSensible = hourlyLeakageVolume / hourlyClinkerProduction * standardAirSpecificHeat * airTemperature;
    return leakageSensible;
}
// (success)2-6
function cal_coalPowderBurning_sensible_enteringNode(hourlyCoalPowder, hourlyClinkerProduction, coalHeatingValue){
    // coalHeatingValue: 人分解炉煤粉收到基低位发热量
    let coalPowderMassStream = cal_coalPowder_massStream_enteringNode(hourlyCoalPowder, hourlyClinkerProduction)
    let coalPowderBurningSensible = coalPowderMassStream * coalHeatingValue;
    return coalPowderBurningSensible;
}
// （success）2-7 废气显热
function cal_wasterGas_sensible_enteringNode(hourlyWasterGasVolume, hourlyClinkerProduction, wasterGasTemperature, carbonMonoxideVolumeFractionWasterGas, carbonDioxideVolumeFractionWasterGas, oxygenVolumeFractionWasterGas, nitrogenVolumeFractionWasterGas, carbonMonoxideSpecificHeatWasterGas, carbonDioxideSpecificHeatWasterGas, oxygenSpecificHeatWasterGas, nitrogenSpecificHeatWasterGas){
    let wasterGasSpecificHeat = (
        (carbonMonoxideVolumeFractionWasterGas * carbonMonoxideSpecificHeatWasterGas) +
        (carbonDioxideVolumeFractionWasterGas * carbonDioxideSpecificHeatWasterGas) +
        (oxygenVolumeFractionWasterGas * oxygenSpecificHeatWasterGas) +
        (nitrogenVolumeFractionWasterGas * nitrogenSpecificHeatWasterGas)) / 100;

    let wasterGasSensible = hourlyWasterGasVolume * wasterGasSpecificHeat * wasterGasTemperature / hourlyClinkerProduction;
    return wasterGasSensible;
}
// (success)2-8 飞灰显热
function cal_ash_sensible_enteringNode(hourlyWasterGasVolume, hourlyClinkerProduction, ashDensity, ashContent, ashSpecificHeat, wasterGasTemperature){
    let ashMassStream = cal_ash_massStream_enteringNode(hourlyWasterGasVolume, hourlyClinkerProduction, ashContent);
    let ashSensible = ashMassStream * ashSpecificHeat * wasterGasTemperature;
    return ashSensible;
}
// (success)2-9: 其他的
function cal_others_sensible_enteringNode(hourlyOthersMass, hourlyClinkerProduction, othersSpecificHeat, othersTemperature){
	let othersMassStream = cal_others_massStream_enteringNode(hourlyOthersMass, hourlyClinkerProduction)
	let othersSensible = othersMassStream * othersSpecificHeat * othersTemperature
	return othersSensible
}
// (success)2-10: 其他的燃烧热
function cal_othersBurning_sensible_enteringNode(hourlyOthersMass, hourlyClinkerProduction, othersHeatingValue){
	let othersMassStream = cal_others_massStream_enteringNode(hourlyOthersMass, hourlyClinkerProduction)
	let othersBurningSensible = othersMassStream * othersHeatingValue;
	return othersBurningSensible
}
// 3.离开冷却炉的物质流
function cal_total_massStream_leavingNode(hourlyLeavingCoalPowder, hourlyClinkerProduction, hourlyWasterGasVolume, carbonMonoxideDensityWasterGas, carbonDioxideDensityWasterGas, oxygenDensityWasterGas, nitrogenDensityWasterGas, carbonMonoxideVolumeFractionWasterGas, carbonDioxideVolumeFractionWasterGas, oxygenVolumeFractionWasterGas, nitrogenVolumeFractionWasterGas, ashContent){
    let coalPowderMassStream = cal_coalPowder_massStream_leavingNode(hourlyLeavingCoalPowder, hourlyClinkerProduction)
    let wasterGasMassStream = cal_wasterGas_massStream_leavingNode(hourlyWasterGasVolume, hourlyClinkerProduction, carbonMonoxideDensityWasterGas, carbonDioxideDensityWasterGas, oxygenDensityWasterGas, nitrogenDensityWasterGas, carbonMonoxideVolumeFractionWasterGas, carbonDioxideVolumeFractionWasterGas, oxygenVolumeFractionWasterGas, nitrogenVolumeFractionWasterGas)
    let ashMassStream = cal_ash_massStream_leavingNode(hourlyWasterGasVolume, hourlyClinkerProduction, ashContent)

    let totalLeavingNodeMassStream = coalPowderMassStream + wasterGasMassStream + ashMassStream;
    return totalLeavingNodeMassStream;
}
// (success)3-1:煤粉
function cal_coalPowder_massStream_leavingNode(hourlyLeavingCoalPowder, hourlyClinkerProduction){
    let coalPowderMassStream = hourlyLeavingCoalPowder / hourlyClinkerProduction;
    return coalPowderMassStream;
}
// (success)3-2:废气
function cal_wasterGas_massStream_leavingNode(hourlyWasterGasVolume, hourlyClinkerProduction, carbonMonoxideDensityWasterGas, carbonDioxideDensityWasterGas, oxygenDensityWasterGas, nitrogenDensityWasterGas, carbonMonoxideVolumeFractionWasterGas, carbonDioxideVolumeFractionWasterGas, oxygenVolumeFractionWasterGas, nitrogenVolumeFractionWasterGas){
    let wasterGasDensity = (
        carbonMonoxideDensityWasterGas * carbonMonoxideVolumeFractionWasterGas +
        carbonDioxideDensityWasterGas * carbonDioxideVolumeFractionWasterGas+
        oxygenDensityWasterGas * oxygenVolumeFractionWasterGas +
        nitrogenDensityWasterGas * nitrogenVolumeFractionWasterGas) / 100;

    let wasterGasMassStream = hourlyWasterGasVolume * wasterGasDensity / hourlyClinkerProduction;
    return wasterGasMassStream
}
// (success)3-3:飞灰
function cal_ash_massStream_leavingNode(hourlyWasterGasVolume, hourlyClinkerProduction, ashContent){
    let ashMassStream = hourlyWasterGasVolume * ashContent / hourlyClinkerProduction;
    return ashMassStream;
}
// 4.离开冷却炉的能量流
function cal_total_energyStream_leavingNode(hourlyRawMaterial, hourlyClinkerProduction, rawMaterialSpecificHeat, rawMaterialTemperature, hourlyWasterGasVolume, wasterGasTemperature, carbonMonoxideVolumeFractionWasterGas, carbonDioxideVolumeFractionWasterGas, oxygenVolumeFractionWasterGas, nitrogenVolumeFractionWasterGas, carbonMonoxideSpecificHeatWasterGas, carbonDioxideSpecificHeatWasterGas, oxygenSpecificHeatWasterGas, nitrogenSpecificHeatWasterGas, ashDensity, ashContent, ashSpecificHeat, ashLoss, rawMaterialLoss, rawMaterialWaterContent, magnesiumOxideContent, calciumOxideContent, hourlyCoalPowder){
    let rawMaterialSensible = cal_rawMaterial_sensible_leavingNode(hourlyRawMaterial, hourlyClinkerProduction, rawMaterialSpecificHeat, rawMaterialTemperature)
    let wasterGasSensible = cal_wasterGas_sensible_leavingNode(hourlyWasterGasVolume, hourlyClinkerProduction, wasterGasTemperature, carbonMonoxideVolumeFractionWasterGas, carbonDioxideVolumeFractionWasterGas, oxygenVolumeFractionWasterGas, nitrogenVolumeFractionWasterGas, carbonMonoxideSpecificHeatWasterGas, carbonDioxideSpecificHeatWasterGas, oxygenSpecificHeatWasterGas, nitrogenSpecificHeatWasterGas)
    let ashSensible = cal_ash_sensible_leavingNode(hourlyWasterGasVolume, hourlyClinkerProduction, ashDensity, ashContent, ashSpecificHeat, wasterGasTemperature)
    let ashDehydrationAndDecompositionHeatSensible = cal_ashDehydrationAndDecompositionHeat_sensible_leavingNode(hourlyWasterGasVolume, hourlyClinkerProduction, ashDensity, ashContent, ashLoss, rawMaterialLoss, rawMaterialWaterContent, magnesiumOxideContent, calciumOxideContent)
    let coalPowderBurningSensible = cal_coalPowderBurning_sensible_leavingNode(hourlyCoalPowder, hourlyClinkerProduction, carbonMonoxideVolumeFractionWasterGas)

    let totalLeavingSensible = rawMaterialSensible + wasterGasSensible + ashSensible + ashDehydrationAndDecompositionHeatSensible + coalPowderBurningSensible;
    return totalLeavingSensible;
}
// (success)4-1: 生料显热
function cal_rawMaterial_sensible_leavingNode(hourlyRawMaterial, hourlyClinkerProduction, rawMaterialSpecificHeat, rawMaterialTemperature){
    let rawMaterialMassStream = cal_rawMaterial_massStream_enteringNode(hourlyRawMaterial, hourlyClinkerProduction)
    let rawMaterialSensible = rawMaterialMassStream * rawMaterialSpecificHeat * rawMaterialTemperature;
    return rawMaterialSensible;
}
// 4-2: 废气显热
function cal_wasterGas_sensible_leavingNode(hourlyWasterGasVolume, hourlyClinkerProduction, wasterGasTemperature, carbonMonoxideVolumeFractionWasterGas, carbonDioxideVolumeFractionWasterGas, oxygenVolumeFractionWasterGas, nitrogenVolumeFractionWasterGas, carbonMonoxideSpecificHeatWasterGas, carbonDioxideSpecificHeatWasterGas, oxygenSpecificHeatWasterGas, nitrogenSpecificHeatWasterGas){
    let wasterGasSpecificHeat = (
        (carbonMonoxideVolumeFractionWasterGas * carbonMonoxideSpecificHeatWasterGas) +
        (carbonDioxideVolumeFractionWasterGas * carbonDioxideSpecificHeatWasterGas) +
        (oxygenVolumeFractionWasterGas * oxygenSpecificHeatWasterGas) +
        (nitrogenVolumeFractionWasterGas * nitrogenSpecificHeatWasterGas)) / 100;

    let wasterGasSensible = hourlyWasterGasVolume * wasterGasSpecificHeat * wasterGasTemperature / hourlyClinkerProduction;
    return wasterGasSensible;
}
// 4-3 飞灰显热
function cal_ash_sensible_leavingNode(hourlyWasterGasVolume, hourlyClinkerProduction, ashDensity, ashContent, ashSpecificHeat, wasterGasTemperature){
    let ashMassStream = cal_ash_massStream_enteringNode(hourlyWasterGasVolume, hourlyClinkerProduction, ashContent);
    let ashSensible = ashMassStream * ashSpecificHeat * wasterGasTemperature;
    return ashSensible;
}
// 4-4 飞灰脱水和碳酸盐分解热
function cal_ashDehydrationAndDecompositionHeat_sensible_leavingNode(hourlyWasterGasVolume, hourlyClinkerProduction, ashDensity, ashContent, ashLoss, rawMaterialLoss, rawMaterialWaterContent, magnesiumOxideContent, calciumOxideContent){
    let ashDehydrationAndDecompositionHeatSensible;

    let carbonDioxideContent = ((calciumOxideContent / 100) * (44 / 56)) + ((magnesiumOxideContent / 100) * (44 / 40.3));
    let ashMassStream = cal_ash_massStream_enteringNode(hourlyWasterGasVolume, hourlyClinkerProduction, ashContent)
    ashDehydrationAndDecompositionHeatSensible = ashMassStream * ((100-ashLoss) / (100-rawMaterialLoss)) * (rawMaterialWaterContent / 100) * 6690 + (ashMassStream * ((100-ashLoss) / (100-rawMaterialLoss)) - ashMassStream * carbonDioxideContent / 100) * (100 / 44) * 1660;

    return ashDehydrationAndDecompositionHeatSensible;
}
// 4-5 煤粉的燃烧
function cal_coalPowderBurning_sensible_leavingNode(hourlyCoalPowder, hourlyClinkerProduction, carbonMonoxideVolumeFractionWasterGas){
    let coalPowderBurningSensible = (hourlyCoalPowder / hourlyClinkerProduction) * (carbonMonoxideVolumeFractionWasterGas / 100) * 12630;
    return coalPowderBurningSensible;
}
