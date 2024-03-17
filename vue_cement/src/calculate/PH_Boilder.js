// PH锅炉的热量收支计算方程流程
// 部分常量定义
// 各个气体的体积分数
// const carbonMonoxideVolumeFraction = 0.1;
// const carbonDioxideVolumeFraction = 0.1;
// const waterVaporVolumeFraction = 0.1;
// const oxygenVolumeFraction = 0.2;
// const nitrogenVolumeFraction = 0.2;
// 各个气体的常压下密度
// const carbonMonoxideDensity = 1.14;
// const carbonDioxideDensity = 1.98;
// const waterVaporDensity = 0.6;
// const oxygenDensity = 1.429;
// const nitrogenDensity = 0.81;
// const liquidWaterDensity = 1000;
// 各个气体的比热
// const carbonMonoxideSpecificHeat = 1040;
// const carbonDioxideSpecificHeat = 840;
// const waterVaporSpecificHeat = 840.7;
// const oxygenSpecificHeat = 918;
// const nitrogenSpecificHeat = 1040;
// 温度常量
// const waterVaporTemperature = 100;
// 流程执行函数
export function fun1(
    hourlyClinkerProduction,
    hourlyWasteGasVolume,
	carbonDioxideVolumeFraction,
	carbonMonoxideVolumeFraction, 
	oxygenVolumeFraction, 
	nitrogenVolumeFraction, 
	ashConcentration,
	hourlyLiquidWaterVolume,
    wasterGasTemperature,
    liquidWaterTemperature,
	hourlyWaterVaporVolume,
	wasterGasTemperaturePH,
	waterVaporTemperature,
	ashFallVelocity,
	ashFallTemperature,
	carbonDioxideSpecificHeatPH,
	carbonMonoxideSpecificHeatPH,
	oxygenSpecificHeatPH,
	nitrogenSpecificHeatPH,
	carbonMonoxideDensity,
	carbonDioxideDensity, 
	oxygenDensity, 
	nitrogenDensity,
    ashSpecificHeat,
	carbonDioxideSpecificHeat,
	carbonMonoxideSpecificHeat,
	oxygenSpecificHeat,
	nitrogenSpecificHeat,
	liquidWaterDensity,
	liquidWaterSpecificHeat,
	waterVaporDensity,
	waterVaporSpecificHeat,
	carbonDioxideVolumeFractionPH,
	carbonMonoxideVolumeFractionPH, 
	oxygenVolumeFractionPH, 
	nitrogenVolumeFractionPH, 
){
    let totalEnteringMassStream = cal_total_massStream_enteringNode(hourlyWasteGasVolume, hourlyClinkerProduction, hourlyLiquidWaterVolume, ashConcentration, carbonDioxideVolumeFraction, carbonMonoxideVolumeFraction, oxygenVolumeFraction, nitrogenVolumeFraction, carbonMonoxideDensity, carbonDioxideDensity, oxygenDensity, nitrogenDensity, liquidWaterDensity);
    let totalEnteringSensible = cal_total_energyStream_enteringNode(hourlyWasteGasVolume, hourlyClinkerProduction, hourlyLiquidWaterVolume, wasterGasTemperature, ashConcentration, ashSpecificHeat, liquidWaterTemperature, liquidWaterSpecificHeat, carbonDioxideVolumeFraction,carbonMonoxideVolumeFraction,oxygenVolumeFraction,nitrogenVolumeFraction,carbonDioxideSpecificHeat,carbonMonoxideSpecificHeat,oxygenSpecificHeat,nitrogenSpecificHeat, liquidWaterDensity);
    let totalLeavingMassStream = cal_total_massStream_leavingNode(hourlyWasteGasVolume, hourlyClinkerProduction, hourlyWaterVaporVolume, ashConcentration, carbonDioxideVolumeFraction, carbonMonoxideVolumeFraction, oxygenVolumeFraction, nitrogenVolumeFraction, carbonMonoxideDensity, carbonDioxideDensity, oxygenDensity, nitrogenDensity, ashFallVelocity, waterVaporDensity);
    let totalLeavingSensible = cal_total_energyStream_leavingNode(hourlyWasteGasVolume, hourlyClinkerProduction, hourlyWaterVaporVolume, wasterGasTemperaturePH, ashConcentration, ashSpecificHeat, waterVaporTemperature, ashFallTemperature, carbonDioxideVolumeFractionPH, carbonMonoxideVolumeFractionPH, oxygenVolumeFractionPH, nitrogenVolumeFractionPH, carbonDioxideSpecificHeatPH, carbonMonoxideSpecificHeatPH, oxygenSpecificHeatPH, nitrogenSpecificHeatPH, ashFallVelocity, waterVaporSpecificHeat)
    // 可计算物质流损失比和热效率
    let massStreamRatio = totalLeavingMassStream / totalEnteringMassStream * 100;
    let thermalEfficiency = totalLeavingSensible / totalEnteringSensible * 100;

    return [massStreamRatio, thermalEfficiency, totalEnteringMassStream, totalEnteringSensible, totalLeavingMassStream, totalLeavingSensible];
}

// (success)1.进入节点的物质流总量
function cal_total_massStream_enteringNode(hourlyWasteGasVolume, hourlyClinkerProduction, hourlyLiquidWaterVolume, ashConcentration, carbonDioxideVolumeFraction, carbonMonoxideVolumeFraction, oxygenVolumeFraction, nitrogenVolumeFraction, carbonMonoxideDensity, carbonDioxideDensity, oxygenDensity, nitrogenDensity, liquidWaterDensity){
    // 进入锅炉的[预热器废气+预热器飞灰+液态水]质量总和
    let wasterGasMassStream = cal_wasteGas_massStream_enteringNode(hourlyWasteGasVolume, hourlyClinkerProduction, carbonDioxideVolumeFraction, carbonMonoxideVolumeFraction, oxygenVolumeFraction, nitrogenVolumeFraction, carbonMonoxideDensity, carbonDioxideDensity, oxygenDensity, nitrogenDensity);
    let ashMassStream = cal_Ash_massStream_enteringNode(ashConcentration, hourlyWasteGasVolume, hourlyClinkerProduction);
    let liquidWaterMassStream = cal_liquidWater_massStream_enteringNode(hourlyLiquidWaterVolume, hourlyClinkerProduction, liquidWaterDensity)

    let totalEnteringMassStream = wasterGasMassStream + ashMassStream + liquidWaterMassStream;
    return totalEnteringMassStream;
}
// (success)1-1.预热器废气物质流公式
function cal_wasteGas_massStream_enteringNode(hourlyWasteGasVolume, hourlyClinkerProduction, carbonDioxideVolumeFraction, carbonMonoxideVolumeFraction, oxygenVolumeFraction, nitrogenVolumeFraction, carbonMonoxideDensity, carbonDioxideDensity, oxygenDensity, nitrogenDensity){
    let wasterGasStandardDensity;
    let wasterGasMassStream;

    wasterGasStandardDensity = (
        (carbonDioxideVolumeFraction * carbonMonoxideDensity) +
        (carbonMonoxideVolumeFraction * carbonDioxideDensity) +
        (oxygenVolumeFraction * oxygenDensity) +
        (nitrogenVolumeFraction * nitrogenDensity)
    ) / 100;

    wasterGasMassStream = (hourlyWasteGasVolume / hourlyClinkerProduction) * wasterGasStandardDensity;

    return wasterGasMassStream;
}
// (success)1-2.预热器飞灰物质流公式
function cal_Ash_massStream_enteringNode(ashConcentration, hourlyWasteGasVolume, hourlyClinkerProduction){
    let ashMassStream = (ashConcentration * hourlyWasteGasVolume) / hourlyClinkerProduction;
    return ashMassStream;
}
// (success)1-3.液态水物质流公式
function cal_liquidWater_massStream_enteringNode(hourlyLiquidWaterVolume, hourlyClinkerProduction, liquidWaterDensity){
    let liquidWaterMassStream = (hourlyLiquidWaterVolume * liquidWaterDensity) / hourlyClinkerProduction;
    return liquidWaterMassStream;
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// (success)2.进入节点的能量流总量
function cal_total_energyStream_enteringNode(hourlyWasteGasVolume, hourlyClinkerProduction, hourlyLiquidWaterVolume, wasterGasTemperature, ashConcentration, ashSpecificHeat, liquidWaterTemperature, liquidWaterSpecificHeat, carbonDioxideVolumeFraction,carbonMonoxideVolumeFraction,oxygenVolumeFraction,nitrogenVolumeFraction,carbonDioxideSpecificHeat,carbonMonoxideSpecificHeat,oxygenSpecificHeat,nitrogenSpecificHeat, liquidWaterDensity){
    let wasterGasSensible = cal_wasterGas_sensible_enteringNode(hourlyWasteGasVolume, hourlyClinkerProduction, wasterGasTemperature, carbonDioxideVolumeFraction,carbonMonoxideVolumeFraction,oxygenVolumeFraction,nitrogenVolumeFraction,carbonDioxideSpecificHeat,carbonMonoxideSpecificHeat,oxygenSpecificHeat,nitrogenSpecificHeat);
    let ashSensible = cal_Ash_sensible_enteringNode(ashConcentration, hourlyWasteGasVolume, hourlyClinkerProduction, ashSpecificHeat, wasterGasTemperature);
    let liquidWaterSensible = cal_liquidWater_sensible_enteringNode(hourlyLiquidWaterVolume, hourlyClinkerProduction, liquidWaterTemperature, liquidWaterSpecificHeat, liquidWaterDensity);

    let totalEnteringSensible = wasterGasSensible + ashSensible + liquidWaterSensible;
    return totalEnteringSensible;
}
// (success)2-1.废气的显热
function cal_wasterGas_sensible_enteringNode(
	hourlyWasteGasVolume, hourlyClinkerProduction, wasterGasTemperature, 
	carbonDioxideVolumeFraction,
	carbonMonoxideVolumeFraction,
	oxygenVolumeFraction,
	nitrogenVolumeFraction,
	carbonDioxideSpecificHeat,
	carbonMonoxideSpecificHeat,
	oxygenSpecificHeat,
	nitrogenSpecificHeat
){
    let wasterGasSpecificHeat;
    let wasterGasSensible;

    wasterGasSpecificHeat = (
        (carbonMonoxideSpecificHeat * carbonMonoxideVolumeFraction) +
        (carbonDioxideSpecificHeat * carbonDioxideVolumeFraction) +
        (oxygenSpecificHeat * oxygenVolumeFraction) +
        (nitrogenSpecificHeat * nitrogenVolumeFraction)
    ) / 100;
    wasterGasSensible = (hourlyWasteGasVolume * wasterGasSpecificHeat * wasterGasTemperature) / hourlyClinkerProduction;
    return wasterGasSensible;
}
// (success)2-2.飞灰的显热
function cal_Ash_sensible_enteringNode(ashConcentration, hourlyWasteGasVolume, hourlyClinkerProduction, ashSpecificHeat, wasterGasTemperature){
    let ashMassStream = cal_Ash_massStream_enteringNode(ashConcentration, hourlyWasteGasVolume, hourlyClinkerProduction);
    let ashSensible = ashMassStream * ashSpecificHeat * wasterGasTemperature;
    return ashSensible;
}
// (success)2-3.液态水的显热
function cal_liquidWater_sensible_enteringNode(hourlyLiquidWaterVolume, hourlyClinkerProduction, liquidWaterTemperature, liquidWaterSpecificHeat, liquidWaterDensity){
    let liquidWaterMassStream = cal_liquidWater_massStream_enteringNode(hourlyLiquidWaterVolume, hourlyClinkerProduction, liquidWaterDensity)
    let liquidWaterSensible = liquidWaterMassStream * liquidWaterSpecificHeat * liquidWaterTemperature;
    return liquidWaterSensible;
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// (success)3.离开节点的物质流总量
function cal_total_massStream_leavingNode(hourlyWasteGasVolume, hourlyClinkerProduction, hourlyWaterVaporVolume, ashConcentration, carbonDioxideVolumeFraction, carbonMonoxideVolumeFraction, oxygenVolumeFraction, nitrogenVolumeFraction, carbonMonoxideDensity, carbonDioxideDensity, oxygenDensity, nitrogenDensity, ashFallVelocity, waterVaporDensity){
    let wasterGasMassStream = cal_wasterGas_massStream_leavingNode(hourlyWasteGasVolume, hourlyClinkerProduction, carbonDioxideVolumeFraction, carbonMonoxideVolumeFraction, oxygenVolumeFraction, nitrogenVolumeFraction, carbonMonoxideDensity, carbonDioxideDensity, oxygenDensity, nitrogenDensity);
    let ashMassStream = cal_Ash_massStream_leavingNode(ashConcentration, hourlyWasteGasVolume, hourlyClinkerProduction, ashFallVelocity);
    let waterVaporMassStream = cal_waterVapor_massStream_leavingNode(hourlyWaterVaporVolume, hourlyClinkerProduction, waterVaporDensity)
	let ashFallMassStream = cal_ashFall_massStream_leavingNode(ashConcentration, hourlyWasteGasVolume, hourlyClinkerProduction, ashFallVelocity)
	
    let totalLeavingMassStream = wasterGasMassStream + ashMassStream + waterVaporMassStream + ashFallMassStream;
    return totalLeavingMassStream;
}
// (success)3-1.离开锅炉的废气物质流
function cal_wasterGas_massStream_leavingNode(hourlyWasteGasVolume, hourlyClinkerProduction, carbonDioxideVolumeFraction, carbonMonoxideVolumeFraction, oxygenVolumeFraction, nitrogenVolumeFraction, carbonMonoxideDensity, carbonDioxideDensity, oxygenDensity, nitrogenDensity){
    let wasterGasMassStream = cal_wasteGas_massStream_enteringNode(hourlyWasteGasVolume, hourlyClinkerProduction, carbonDioxideVolumeFraction, carbonMonoxideVolumeFraction, oxygenVolumeFraction, nitrogenVolumeFraction, carbonMonoxideDensity, carbonDioxideDensity, oxygenDensity, nitrogenDensity);
    return wasterGasMassStream;
}
// (success)3-2.离开锅炉的飞灰物质流
function cal_Ash_massStream_leavingNode(ashConcentration, hourlyWasteGasVolume, hourlyClinkerProduction, ashFallVelocity){
    let ashMassStream = cal_Ash_massStream_enteringNode(ashConcentration, hourlyWasteGasVolume, hourlyClinkerProduction);
	let PHAshMassStream = ashMassStream * (1 - ashFallVelocity)
    return PHAshMassStream;
}
// (success)3-3.离开锅炉的水蒸气物质流
function cal_waterVapor_massStream_leavingNode(hourlyWaterVaporVolume, hourlyClinkerProduction, waterVaporDensity){
    let waterVaporMassStream = (hourlyWaterVaporVolume * waterVaporDensity) / hourlyClinkerProduction;
    return waterVaporMassStream;
}
// (success)3-4: 沉降的飞灰
function cal_ashFall_massStream_leavingNode(ashConcentration, hourlyWasteGasVolume, hourlyClinkerProduction, ashFallVelocity){
	let ashMassStream = cal_Ash_massStream_enteringNode(ashConcentration, hourlyWasteGasVolume, hourlyClinkerProduction)
	let ashFallMassStream = ashMassStream * ashFallVelocity
	return ashFallMassStream
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// 4.离开节点的能量总和
function cal_total_energyStream_leavingNode(hourlyWasteGasVolume, hourlyClinkerProduction, hourlyWaterVaporVolume, wasterGasTemperaturePH, ashConcentration, ashSpecificHeat, waterVaporTemperature, ashFallTemperature, carbonDioxideVolumeFractionPH, carbonMonoxideVolumeFractionPH, oxygenVolumeFractionPH, nitrogenVolumeFractionPH, carbonDioxideSpecificHeatPH, carbonMonoxideSpecificHeatPH, oxygenSpecificHeatPH, nitrogenSpecificHeatPH, ashFallVelocity, waterVaporSpecificHeat){
    let wasterGasSensible = cal_wasterGas_sensible_leavingNode(hourlyWasteGasVolume, hourlyClinkerProduction, wasterGasTemperaturePH, carbonDioxideVolumeFractionPH, carbonMonoxideVolumeFractionPH, oxygenVolumeFractionPH, nitrogenVolumeFractionPH, carbonDioxideSpecificHeatPH, carbonMonoxideSpecificHeatPH, oxygenSpecificHeatPH, nitrogenSpecificHeatPH)
    let ashSensible = cal_Ash_sensible_leavingNode(ashConcentration, hourlyWasteGasVolume, hourlyClinkerProduction, ashSpecificHeat, wasterGasTemperaturePH);
    let waterVaporSensible = cal_waterVapor_sensible_leavingNode(hourlyWaterVaporVolume, hourlyClinkerProduction, waterVaporTemperature, waterVaporSpecificHeat);
	let ashFallSensible = cal_ashFall_sensible_leavingNode(ashConcentration, hourlyWasteGasVolume, hourlyClinkerProduction, ashFallVelocity, ashSpecificHeat, ashFallTemperature)

    let totalLeavingSensible = wasterGasSensible + ashSensible + waterVaporSensible + ashFallSensible;
    return totalLeavingSensible;
}
// (success)4-1.离开的废气显热
function cal_wasterGas_sensible_leavingNode(hourlyWasteGasVolume, hourlyClinkerProduction, wasterGasTemperaturePH, carbonDioxideVolumeFractionPH, carbonMonoxideVolumeFractionPH, oxygenVolumeFractionPH, nitrogenVolumeFractionPH, carbonDioxideSpecificHeatPH, carbonMonoxideSpecificHeatPH, oxygenSpecificHeatPH, nitrogenSpecificHeatPH){
    let wasterGasSensible;
	let wasterGasSpecificHeat = (
		(carbonMonoxideSpecificHeatPH * carbonMonoxideVolumeFractionPH) +
		(carbonDioxideSpecificHeatPH * carbonDioxideVolumeFractionPH) +
		(oxygenSpecificHeatPH * oxygenVolumeFractionPH) +
		(nitrogenSpecificHeatPH * nitrogenVolumeFractionPH)
	) / 100;
    wasterGasSensible = hourlyWasteGasVolume * wasterGasSpecificHeat * wasterGasTemperaturePH / hourlyClinkerProduction;
    return wasterGasSensible;
}
// (success)4-2.离开的飞灰显热
function cal_Ash_sensible_leavingNode(ashConcentration, hourlyWasteGasVolume, hourlyClinkerProduction, ashSpecificHeat, wasterGasTemperaturePH){
    let ashMassStream = cal_Ash_massStream_enteringNode(ashConcentration, hourlyWasteGasVolume, hourlyClinkerProduction);
    let ashSensible = ashMassStream * ashSpecificHeat * wasterGasTemperaturePH;
    return ashSensible;
}
// (success)4-3.离开的水蒸气显热
function cal_waterVapor_sensible_leavingNode(hourlyWaterVaporVolume, hourlyClinkerProduction, waterVaporTemperature, waterVaporSpecificHeat){
    let waterVaporSensible = hourlyWaterVaporVolume * waterVaporSpecificHeat * waterVaporTemperature / hourlyClinkerProduction;
    return waterVaporSensible;
}
// (success)4-4:沉降飞灰的温度
function cal_ashFall_sensible_leavingNode(
	ashConcentration, 
	hourlyWasteGasVolume, 
	hourlyClinkerProduction, 
	ashFallVelocity,
	ashSpecificHeat,
	ashFallTemperature
){
	let ashFallMassStream = cal_ashFall_massStream_leavingNode(ashConcentration, hourlyWasteGasVolume, hourlyClinkerProduction, ashFallVelocity)
	let ashFallSensible = ashFallMassStream * ashFallTemperature * ashSpecificHeat
	return ashFallSensible
}