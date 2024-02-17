// AQC锅炉的热量收支计算方程流程
// 部分常量定义
// 各个气体的常压下密度
const waterVaporDensity = 0.6;
const liquidWaterDensity = 1000;
// 各个气体的比热
const waterVaporSpecificHeat = 1850;
const liquidWaterSpecificHeat = 4200;
// 温度常量
// 流程执行函数
export function fun6(
    hourlyAQCAirVolume,
    hourlyClinkerProduction,
    hourlyAirVolume,
    hourlyLiquidWater,
    hourlyWaterVaporVolume,
    ashDensity,
    airDensity,
    airSpecificHeat,
    ashSpecificHeat,
    airTemperature,
    liquidWaterTemperature,
    waterVaporTemperature
){
    let totalEnteringMassStream = cal_total_massStream_enteringNode(
        hourlyAQCAirVolume,
        hourlyClinkerProduction,
        hourlyAirVolume,
        hourlyLiquidWater,
        ashDensity,
        airDensity
    )
    let totalEnteringSensible = cal_total_sensible_enteringNode(
        hourlyAQCAirVolume,
        hourlyClinkerProduction,
        hourlyAirVolume,
        hourlyLiquidWater,
        ashDensity,
        airSpecificHeat,
        ashSpecificHeat,
        airTemperature,
        airTemperature,
        liquidWaterTemperature
    )
    let totalLeavingMassStream = cal_total_massStream_leavingNode(
        hourlyAQCAirVolume,
        hourlyClinkerProduction,
        hourlyAirVolume,
        hourlyWaterVaporVolume,
        ashDensity,
        airDensity,
        ashSpecificHeat,
        airTemperature
    )
    let totalLeavingSensible = cal_total_sensible_leavingNode(
        hourlyAQCAirVolume,
        hourlyClinkerProduction,
        hourlyAirVolume,
        hourlyWaterVaporVolume,
        ashDensity,
        airDensity,
        airSpecificHeat,
        airTemperature,
        ashSpecificHeat,
        waterVaporTemperature
    )

    // 可计算物质流损失比和热效率
    let massStreamRatio = totalLeavingMassStream / totalEnteringMassStream * 100;
    let thermalEfficiency = totalLeavingSensible / totalEnteringSensible * 100;

    return [massStreamRatio, thermalEfficiency];
}

function cal_total_massStream_enteringNode(
    hourlyAQCAirVolume,
    hourlyClinkerProduction,
    hourlyAirVolume,
    hourlyLiquidWater,
    ashDensity,
    airDensity
) {
    let AQCAirMassStream = cal_AQCAir_massStream_enteringNode(hourlyAQCAirVolume, hourlyClinkerProduction, airDensity)
    let ashMassStream = cal_ash_massStream_enteringNode(hourlyAirVolume, ashDensity, hourlyClinkerProduction)
    let liquidWaterMassStream = cal_liquidWater_massStream_enteringNode(hourlyLiquidWater, hourlyClinkerProduction)

    let totalEnteringMassStream = AQCAirMassStream + ashMassStream + liquidWaterMassStream
    return totalEnteringMassStream
}
// 1-1：来自冷却机的空气
function cal_AQCAir_massStream_enteringNode(hourlyAQCAirVolume, hourlyClinkerProduction, airDensity){
    let AQCAirMassStream = hourlyAQCAirVolume * airDensity / hourlyClinkerProduction;
    return AQCAirMassStream;
}
// 1-2：来自冷却机的飞灰
function cal_ash_massStream_enteringNode(hourlyAirVolume, ashDensity, hourlyClinkerProduction){
    let ashMassStream = hourlyAirVolume * ashDensity / hourlyClinkerProduction
    return ashMassStream
}
// 1-3：来自冷却机的液态水
function cal_liquidWater_massStream_enteringNode(hourlyLiquidWater, hourlyClinkerProduction){
    let liquidWaterMassStream = hourlyLiquidWater * liquidWaterDensity / hourlyClinkerProduction;
    return liquidWaterMassStream;
}
// 2.进入冷却炉的能量流
function cal_total_sensible_enteringNode(
    hourlyAQCAirVolume,
    hourlyClinkerProduction,
    hourlyAirVolume,
    hourlyLiquidWater,
    ashDensity,
    airSpecificHeat,
    ashSpecificHeat,
    airTemperature,
    liquidWaterTemperature
){
    let AQCAirSensible = cal_AQCAir_sensible_enteringNode(hourlyAQCAirVolume, hourlyClinkerProduction, airSpecificHeat, airTemperature)
    let ashSensible = cal_ash_sensible_enteringNode(hourlyAirVolume, ashDensity, hourlyClinkerProduction, ashSpecificHeat, airTemperature)
    let liquidWaterSensible = cal_liquidWater_sensible_enteringNode(hourlyLiquidWater, hourlyClinkerProduction, liquidWaterTemperature)

    let totalEnteringSensible = AQCAirSensible + ashSensible + liquidWaterSensible
    return totalEnteringSensible
}
// 2-1：空气显热
function cal_AQCAir_sensible_enteringNode(hourlyAQCAirVolume, hourlyClinkerProduction, airSpecificHeat, airTemperature){
    let AQCAirSensible = hourlyAQCAirVolume * airSpecificHeat * airTemperature / hourlyClinkerProduction
    return AQCAirSensible
}
// 2-2：飞灰显热
function cal_ash_sensible_enteringNode(hourlyAirVolume, ashDensity, hourlyClinkerProduction, ashSpecificHeat, airTemperature){
    let ashMassStream = cal_ash_massStream_enteringNode(hourlyAirVolume, ashDensity, hourlyClinkerProduction)
    let ashSensible = ashMassStream * ashSpecificHeat * airTemperature;
    return ashSensible
}
// 2-3：液态水显热
function cal_liquidWater_sensible_enteringNode(hourlyLiquidWater, hourlyClinkerProduction, liquidWaterTemperature){
    let liquidWaterMassStream = cal_liquidWater_massStream_enteringNode(hourlyLiquidWater, hourlyClinkerProduction)
    let liquidWaterSensible = liquidWaterMassStream * liquidWaterSpecificHeat * liquidWaterTemperature
    return liquidWaterSensible
}
// 3.离开冷却炉的物质流
function cal_total_massStream_leavingNode(
    hourlyAQCAirVolume,
    hourlyClinkerProduction,
    hourlyAirVolume,
    hourlyWaterVaporVolume,
    ashDensity,
    airDensity,
    ashSpecificHeat,
    airTemperature
){
    let AQCAirMassStream = cal_AQCAir_massStream_leavingNode(hourlyAQCAirVolume, hourlyClinkerProduction, airDensity)
    let ashMassStream = cal_ash_massStream_leavingNode(hourlyAirVolume, ashDensity, hourlyClinkerProduction, ashSpecificHeat, airTemperature)
    let waterVaporMassStream = cal_waterVapor_massStream_leavingNode(hourlyWaterVaporVolume, hourlyClinkerProduction)

    let totalLeavingMassStream = AQCAirMassStream + ashMassStream + waterVaporMassStream
    return totalLeavingMassStream;
}
// 3-1：离开的空气物质流
function cal_AQCAir_massStream_leavingNode(hourlyAQCAirVolume, hourlyClinkerProduction, airDensity){
    let AQCAirMassStream = hourlyAQCAirVolume * airDensity / hourlyClinkerProduction;
    return AQCAirMassStream;
}
// 3-2：离开的飞灰物质流
function cal_ash_massStream_leavingNode(hourlyAirVolume, ashDensity, hourlyClinkerProduction, ashSpecificHeat, airTemperature){
    let ashMassStream = cal_ash_sensible_enteringNode(hourlyAirVolume, ashDensity, hourlyClinkerProduction, ashSpecificHeat, airTemperature)
    return ashMassStream
}
// 3-3：离开的水蒸气物质流
function cal_waterVapor_massStream_leavingNode(hourlyWaterVaporVolume, hourlyClinkerProduction){
    let waterVaporMassStream = hourlyWaterVaporVolume * waterVaporDensity / hourlyClinkerProduction
    return waterVaporMassStream
}
// 4.离开冷却炉的能量流
function cal_total_sensible_leavingNode(
    hourlyAQCAirVolume,
    hourlyClinkerProduction,
    hourlyAirVolume,
    hourlyWaterVaporVolume,
    ashDensity,
    airDensity,
    airSpecificHeat,
    airTemperature,
    ashSpecificHeat,
    waterVaporTemperature
){
    let airSensible = cal_air_sensible_leavingNode(hourlyAQCAirVolume, hourlyClinkerProduction, airDensity, airSpecificHeat, airTemperature)
    let ashSensible = cal_ash_sensible_leavingNode(hourlyAirVolume, ashDensity, hourlyClinkerProduction, ashSpecificHeat, airTemperature)
    let waterVaporSensible = cal_waterVapor_sensible_leavingNode(hourlyWaterVaporVolume, hourlyClinkerProduction, waterVaporTemperature)

    let totalLeavingSensible = airSensible + ashSensible + waterVaporSensible
    return totalLeavingSensible
}
// 4-1：空气显热
function cal_air_sensible_leavingNode(hourlyAQCAirVolume, hourlyClinkerProduction, airDensity, airSpecificHeat, airTemperature){
    let airSensible = cal_AQCAir_massStream_enteringNode(hourlyAQCAirVolume, hourlyClinkerProduction, airDensity) * airSpecificHeat * airTemperature
    return airSensible
}
// 4-2：飞灰显热
function cal_ash_sensible_leavingNode(hourlyAirVolume, ashDensity, hourlyClinkerProduction, ashSpecificHeat, airTemperature){
    let ashSensible = cal_ash_massStream_enteringNode(hourlyAirVolume, ashDensity, hourlyClinkerProduction) * ashSpecificHeat * airTemperature
    return ashSensible
}
// 4-3：水蒸气显热
function cal_waterVapor_sensible_leavingNode(hourlyWaterVaporVolume, hourlyClinkerProduction, waterVaporTemperature){
    let waterVaporSensible = hourlyWaterVaporVolume * waterVaporSpecificHeat * waterVaporTemperature / hourlyClinkerProduction
    return waterVaporSensible
}