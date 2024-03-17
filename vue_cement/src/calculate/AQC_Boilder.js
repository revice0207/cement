// AQC锅炉的热量收支计算方程流程
// 部分常量定义
// 各个气体的常压下密度
const standardAirDensity = 100;
const standardAirSpecificHeat = 100;
const waterVaporDensity = 0.6;
const liquidWaterDensity = 1000;
// 各个气体的比热
const waterVaporSpecificHeat = 1850;
const liquidWaterSpecificHeat = 4200;
// 温度常量
// 流程执行函数
export function fun6(
	hourlyAQCWater, 
	liquidWaterTemperature,
	ashFallVelocity,
	hourlyWaterVaporVolume,
    OutAQCAirTemperature,
	ashFallTemperature,
	waterVaporTemperature, 
	ashSpecificHeat,
    hourlyAQCAirVolume, 
	hourlyClinkerProduction, 
	ashContent,
	hourlyAirVolume, 
	AQCAirTemperature
){
    let totalEnteringMassStream = cal_total_massStream_enteringNode(hourlyAQCAirVolume, hourlyClinkerProduction, hourlyAQCWater, ashContent)
    let totalEnteringSensible = cal_total_sensible_enteringNode(hourlyAQCAirVolume, hourlyClinkerProduction, hourlyAirVolume, hourlyAQCWater, ashContent, standardAirSpecificHeat, ashSpecificHeat, AQCAirTemperature, liquidWaterTemperature)
    let totalLeavingMassStream = cal_total_massStream_leavingNode(hourlyAQCAirVolume, hourlyClinkerProduction, standardAirDensity, ashContent, ashFallVelocity, hourlyWaterVaporVolume)
    let totalLeavingSensible = cal_total_sensible_leavingNode(hourlyAQCAirVolume, hourlyClinkerProduction, standardAirDensity, OutAQCAirTemperature, ashContent, hourlyWaterVaporVolume, waterVaporTemperature,  ashFallVelocity, ashSpecificHeat, ashFallTemperature)

    // 可计算物质流损失比和热效率
    let massStreamRatio = totalLeavingMassStream / totalEnteringMassStream * 100;
    let thermalEfficiency = totalLeavingSensible / totalEnteringSensible * 100;

    return [massStreamRatio, thermalEfficiency, totalEnteringMassStream, totalEnteringSensible, totalLeavingMassStream, totalLeavingSensible];
}

function cal_total_massStream_enteringNode(hourlyAQCAirVolume, hourlyClinkerProduction, hourlyAQCWater, ashContent) {
    let AQCAirMassStream = cal_AQCAir_massStream_enteringNode(hourlyAQCAirVolume, hourlyClinkerProduction)
    let ashMassStream = cal_ash_massStream_enteringNode(hourlyAQCAirVolume, ashContent, hourlyClinkerProduction)
    let liquidWaterMassStream = cal_liquidWater_massStream_enteringNode(hourlyAQCWater, hourlyClinkerProduction)

    let totalEnteringMassStream = AQCAirMassStream + ashMassStream + liquidWaterMassStream
    return totalEnteringMassStream
}
// (success)1-1：来自冷却机的空气
function cal_AQCAir_massStream_enteringNode(hourlyAQCAirVolume, hourlyClinkerProduction){
    let AQCAirMassStream = hourlyAQCAirVolume * standardAirDensity / hourlyClinkerProduction;
    return AQCAirMassStream;
}
// (success)1-2：来自冷却机的飞灰
function cal_ash_massStream_enteringNode(hourlyAQCAirVolume, ashContent, hourlyClinkerProduction){
    let ashMassStream = hourlyAQCAirVolume * ashContent / hourlyClinkerProduction
    return ashMassStream
}
// (success)1-3：来自冷却机的液态水
function cal_liquidWater_massStream_enteringNode(hourlyAQCWater, hourlyClinkerProduction){
    let liquidWaterMassStream = hourlyAQCWater * liquidWaterDensity / hourlyClinkerProduction;
    return liquidWaterMassStream;
}
// 2.进入冷却炉的能量流
function cal_total_sensible_enteringNode(hourlyAQCAirVolume, hourlyClinkerProduction, hourlyAirVolume, hourlyAQCWater, ashContent, standardAirSpecificHeat, ashSpecificHeat, AQCAirTemperature, liquidWaterTemperature){
    let AQCAirSensible = cal_AQCAir_sensible_enteringNode(hourlyAQCAirVolume, hourlyClinkerProduction, AQCAirTemperature)
    let ashSensible = cal_ash_sensible_enteringNode(hourlyAQCAirVolume, ashContent, hourlyClinkerProduction, ashSpecificHeat, AQCAirTemperature)
    let liquidWaterSensible = cal_liquidWater_sensible_enteringNode(hourlyAQCWater, hourlyClinkerProduction, liquidWaterTemperature)

    let totalEnteringSensible = AQCAirSensible + ashSensible + liquidWaterSensible
    return totalEnteringSensible
}
// (success)2-1：空气显热
function cal_AQCAir_sensible_enteringNode(hourlyAQCAirVolume, hourlyClinkerProduction, AQCAirTemperature){
    let AQCAirSensible = hourlyAQCAirVolume * standardAirSpecificHeat * AQCAirTemperature / hourlyClinkerProduction
    return AQCAirSensible
}
// (success)2-2：冷却机飞灰显热
function cal_ash_sensible_enteringNode(hourlyAQCAirVolume, ashContent, hourlyClinkerProduction, ashSpecificHeat, AQCAirTemperature){
    let ashMassStream = cal_ash_massStream_enteringNode(hourlyAQCAirVolume, ashContent, hourlyClinkerProduction)
    let ashSensible = ashMassStream * ashSpecificHeat * AQCAirTemperature;
    return ashSensible
}
// (success)2-3：液态水显热
function cal_liquidWater_sensible_enteringNode(hourlyAQCWater, hourlyClinkerProduction, liquidWaterTemperature){
    let liquidWaterMassStream = cal_liquidWater_massStream_enteringNode(hourlyAQCWater, hourlyClinkerProduction)
    let liquidWaterSensible = liquidWaterMassStream * liquidWaterSpecificHeat * liquidWaterTemperature
    return liquidWaterSensible
}
// 3.离开冷却炉的物质流
function cal_total_massStream_leavingNode(hourlyAQCAirVolume, hourlyClinkerProduction, standardAirDensity, ashContent, ashFallVelocity, hourlyWaterVaporVolume){
    let AQCAirMassStream = cal_AQCAir_massStream_leavingNode(hourlyAQCAirVolume, hourlyClinkerProduction, standardAirDensity)
    let ashMassStream = cal_ash_massStream_leavingNode(hourlyAQCAirVolume, ashContent, hourlyClinkerProduction, ashFallVelocity)
    let waterVaporMassStream = cal_waterVapor_massStream_leavingNode(hourlyWaterVaporVolume, hourlyClinkerProduction)
	let ashFallMassStream = cal_ashFall_massStream_leavingNode(hourlyAQCAirVolume, ashContent, hourlyClinkerProduction, ashFallVelocity)
    let totalLeavingMassStream = AQCAirMassStream + ashMassStream + waterVaporMassStream + ashFallMassStream
    return totalLeavingMassStream;
}
// (success)3-1：离开的空气物质流
function cal_AQCAir_massStream_leavingNode(hourlyAQCAirVolume, hourlyClinkerProduction, standardAirDensity){
    let AQCAirMassStream = cal_AQCAir_massStream_leavingNode(hourlyAQCAirVolume, hourlyClinkerProduction, standardAirDensity)
    return AQCAirMassStream;
}
// (success)3-2：离开的飞灰物质流
function cal_ash_massStream_leavingNode(hourlyAQCAirVolume, ashContent, hourlyClinkerProduction, ashFallVelocity){
    let tempMassStream = cal_ash_massStream_enteringNode(hourlyAQCAirVolume, ashContent, hourlyClinkerProduction)
	let ashMassStream = (1 - ashFallVelocity) * tempMassStream
    return ashMassStream
}
// (success)3-3：离开的水蒸气物质流
function cal_waterVapor_massStream_leavingNode(hourlyWaterVaporVolume, hourlyClinkerProduction){
    let waterVaporMassStream = hourlyWaterVaporVolume * waterVaporDensity / hourlyClinkerProduction
    return waterVaporMassStream
}
// (success)3-4: 沉降的飞灰
function cal_ashFall_massStream_leavingNode(hourlyAQCAirVolume, ashContent, hourlyClinkerProduction, ashFallVelocity){
	let tempMassStream = cal_ash_massStream_enteringNode(hourlyAQCAirVolume, ashContent, hourlyClinkerProduction)
	let ashFallMassStream = ashFallVelocity * tempMassStream
	return ashFallMassStream
}
// 4.离开冷却炉的能量流
function cal_total_sensible_leavingNode(hourlyAQCAirVolume, hourlyClinkerProduction, standardAirDensity, OutAQCAirTemperature, ashContent, hourlyWaterVaporVolume, waterVaporTemperature,  ashFallVelocity, ashSpecificHeat, ashFallTemperature){
    let airSensible = cal_air_sensible_leavingNode(hourlyAQCAirVolume, hourlyClinkerProduction, standardAirDensity, OutAQCAirTemperature)
    let ashSensible = cal_ash_sensible_leavingNode(hourlyAQCAirVolume, ashContent, hourlyClinkerProduction, OutAQCAirTemperature)
    let waterVaporSensible = cal_waterVapor_sensible_leavingNode(hourlyWaterVaporVolume, hourlyClinkerProduction, waterVaporTemperature)
	let ashFallSensible = cal_ashFall_sensible_leavingNode(hourlyAQCAirVolume, ashContent, hourlyClinkerProduction, ashFallVelocity, ashSpecificHeat, ashFallTemperature)
	
    let totalLeavingSensible = airSensible + ashSensible + waterVaporSensible + ashFallSensible
    return totalLeavingSensible
}
// (success)4-1：空气显热
function cal_air_sensible_leavingNode(hourlyAQCAirVolume, hourlyClinkerProduction, standardAirDensity, OutAQCAirTemperature){
    let airSensible = cal_AQCAir_massStream_leavingNode(hourlyAQCAirVolume, hourlyClinkerProduction, standardAirDensity) * standardAirSpecificHeat * OutAQCAirTemperature
    return airSensible
}
// (success)4-2：飞灰显热
function cal_ash_sensible_leavingNode(hourlyAQCAirVolume, ashContent, hourlyClinkerProduction, OutAQCAirTemperature){
    let ashSensible = cal_ash_massStream_enteringNode(hourlyAQCAirVolume, ashContent, hourlyClinkerProduction) * standardAirSpecificHeat * OutAQCAirTemperature
    return ashSensible
}
// (success)4-3：水蒸气显热
function cal_waterVapor_sensible_leavingNode(hourlyWaterVaporVolume, hourlyClinkerProduction, waterVaporTemperature){
    let waterVaporSensible = hourlyWaterVaporVolume * waterVaporSpecificHeat * waterVaporTemperature / hourlyClinkerProduction
    return waterVaporSensible
}
// (success)4-4:飞灰沉降温度
function cal_ashFall_sensible_leavingNode(hourlyAQCAirVolume, ashContent, hourlyClinkerProduction, ashFallVelocity, ashSpecificHeat, ashFallTemperature){
	let ashFallMassStream = cal_ashFall_massStream_leavingNode(hourlyAQCAirVolume, ashContent, hourlyClinkerProduction, ashFallVelocity)
	let ashFallSensible = ashFallMassStream * ashSpecificHeat * ashFallTemperature
	return ashFallSensible
}