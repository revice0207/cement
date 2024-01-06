// 冷却机的热量收支计算方程流程
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
export function fun1(
    hourlyWasteGasVolume,
    hourlyClinkerProduction,
    hourlyLiquidWaterVolume,
    hourlyWaterVaporVolume,
    ashConcentration,
    ashSpecificHeat,
    averageWasterGasSpecificHeat,
    wasterGasTemperature,
    wasterGasTemperaturePH,
    liquidWaterTemperature
){
    let totalEnteringMassStream = cal_total_massStream_enteringNode(hourlyWasteGasVolume, hourlyClinkerProduction, hourlyLiquidWaterVolume, ashConcentration);
    let totalEnteringSensible = cal_total_energyStream_enteringNode(hourlyWasteGasVolume, hourlyClinkerProduction, hourlyLiquidWaterVolume, wasterGasTemperature, ashConcentration, ashSpecificHeat, liquidWaterTemperature);
    let totalLeavingMassStream = cal_total_massStream_leavingNode(hourlyWasteGasVolume, hourlyClinkerProduction, hourlyWaterVaporVolume, ashConcentration);
    let totalLeavingSensible = cal_total_energyStream_leavingNode(hourlyWasteGasVolume, hourlyClinkerProduction, hourlyWaterVaporVolume, averageWasterGasSpecificHeat, wasterGasTemperaturePH, ashConcentration, ashSpecificHeat);

    // 可计算物质流损失比和热效率
    let massStreamRatio = totalLeavingMassStream / totalEnteringMassStream * 100;
    let thermalEfficiency = totalLeavingSensible / totalEnteringSensible * 100;

    return [massStreamRatio, thermalEfficiency];
}

// 1.进入节点的物质流总量
function cal_total_massStream_enteringNode(hourlyWasteGasVolume, hourlyClinkerProduction, hourlyLiquidWaterVolume, ashConcentration){
    // 进入锅炉的[预热器废气+预热器飞灰+液态水]质量总和
    let wasterGasMassStream = cal_wasteGas_massStream_enteringNode(hourlyWasteGasVolume, hourlyClinkerProduction);
    let ashMassStream = cal_Ash_massStream_enteringNode(ashConcentration, hourlyWasteGasVolume, hourlyClinkerProduction);
    let liquidWaterMassStream = cal_liquidWater_massStream_enteringNode(hourlyLiquidWaterVolume, hourlyClinkerProduction);

    let totalEnteringMassStream = wasterGasMassStream + ashMassStream + liquidWaterMassStream;
    return totalEnteringMassStream;
}
// 1-1.预热器废气物质流公式
function cal_wasteGas_massStream_enteringNode(hourlyWasteGasVolume, hourlyClinkerProduction){
    let wasterGasStandardDensity;
    let wasterGasMassStream;

    wasterGasStandardDensity = (
        (carbonDioxideVolumeFraction * carbonMonoxideDensity) +
        (carbonMonoxideVolumeFraction * carbonDioxideDensity) +
        (waterVaporVolumeFraction * waterVaporDensity) +
        (oxygenVolumeFraction * oxygenDensity) +
        (nitrogenVolumeFraction * nitrogenDensity)
    ) / 100;

    wasterGasMassStream = (hourlyWasteGasVolume / hourlyClinkerProduction) * wasterGasStandardDensity;

    return wasterGasMassStream;
}
// 1-2.预热器飞灰物质流公式
function cal_Ash_massStream_enteringNode(ashConcentration, hourlyWasteGasVolume, hourlyClinkerProduction){
    let ashMassStream = (ashConcentration * hourlyWasteGasVolume) / hourlyClinkerProduction;
    return ashMassStream;
}
// 1-3.液态水物质流公式
function cal_liquidWater_massStream_enteringNode(hourlyLiquidWaterVolume, hourlyClinkerProduction){
    let liquidWaterMassStream = (hourlyLiquidWaterVolume * liquidWaterDensity) / hourlyClinkerProduction;
    return liquidWaterMassStream;
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// 2.进入节点的能量流总量
function cal_total_energyStream_enteringNode(hourlyWasteGasVolume, hourlyClinkerProduction, hourlyLiquidWaterVolume, wasterGasTemperature, ashConcentration, ashSpecificHeat, liquidWaterTemperature){
    let wasterGasSensible = cal_wasterGas_sensible_enteringNode(hourlyWasteGasVolume, hourlyClinkerProduction, wasterGasTemperature);
    let ashSensible = cal_Ash_sensible_enteringNode(ashConcentration, hourlyWasteGasVolume, hourlyClinkerProduction, ashSpecificHeat, wasterGasTemperature);
    let liquidWaterSensible = cal_liquidWater_sensible_enteringNode(hourlyLiquidWaterVolume, hourlyClinkerProduction, liquidWaterTemperature);

    let totalEnteringSensible = wasterGasSensible + ashSensible + liquidWaterSensible;
    return totalEnteringSensible;
}
// 2-1.废气的显热
function cal_wasterGas_sensible_enteringNode(hourlyWasteGasVolume, hourlyClinkerProduction, wasterGasTemperature){
    let wasterGasSpecificHeat;
    let wasterGasSensible;

    wasterGasSpecificHeat = (
        (carbonMonoxideSpecificHeat * carbonMonoxideVolumeFraction) +
        (carbonDioxideSpecificHeat * carbonDioxideVolumeFraction) +
        (waterVaporSpecificHeat * waterVaporVolumeFraction) +
        (oxygenSpecificHeat * oxygenVolumeFraction) +
        (nitrogenSpecificHeat * nitrogenVolumeFraction)
    ) / 100;
    wasterGasSensible = (hourlyWasteGasVolume * wasterGasSpecificHeat * wasterGasTemperature) / hourlyClinkerProduction;
    return wasterGasSensible;
}
// 2-2.飞灰的显热
function cal_Ash_sensible_enteringNode(ashConcentration, hourlyWasteGasVolume, hourlyClinkerProduction, ashSpecificHeat, wasterGasTemperature){
    let ashMassStream = cal_Ash_massStream_enteringNode(ashConcentration, hourlyWasteGasVolume, hourlyClinkerProduction);
    let ashSensible = ashMassStream * ashSpecificHeat * wasterGasTemperature;
    return ashSensible;
}
// 2-3.液态水的显热
function cal_liquidWater_sensible_enteringNode(hourlyLiquidWaterVolume, hourlyClinkerProduction, liquidWaterTemperature){
    let liquidWaterMassStream = cal_liquidWater_massStream_enteringNode(hourlyLiquidWaterVolume, hourlyClinkerProduction);
    let liquidWaterSensible = liquidWaterMassStream * liquidWaterSpecificHeat * liquidWaterTemperature;
    return liquidWaterSensible;
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// 3.离开节点的物质流总量
function cal_total_massStream_leavingNode(hourlyWasteGasVolume, hourlyClinkerProduction, hourlyWaterVaporVolume, ashConcentration){
    let wasterGasMassStream = cal_wasterGas_massStream_leavingNode(hourlyWasteGasVolume, hourlyClinkerProduction);
    let ashMassStream = cal_Ash_massStream_leavingNode(ashConcentration, hourlyWasteGasVolume, hourlyClinkerProduction);
    let waterVaporMassStream = cal_waterVapor_massStream_leavingNode(hourlyWaterVaporVolume, hourlyClinkerProduction);

    let totalLeavingMassStream = wasterGasMassStream + ashMassStream + waterVaporMassStream;
    return totalLeavingMassStream;
}
// 3-1.离开锅炉的废气物质流
function cal_wasterGas_massStream_leavingNode(hourlyWasteGasVolume, hourlyClinkerProduction){
    let wasterGasMassStream = cal_wasteGas_massStream_enteringNode(hourlyWasteGasVolume, hourlyClinkerProduction);
    return wasterGasMassStream;
}
// 3-2.离开锅炉的飞灰物质流
function cal_Ash_massStream_leavingNode(ashConcentration, hourlyWasteGasVolume, hourlyClinkerProduction){
    let ashMassStream = cal_Ash_massStream_enteringNode(ashConcentration, hourlyWasteGasVolume, hourlyClinkerProduction);
    return ashMassStream;
}
// 3-3.离开锅炉的水蒸气物质流
function cal_waterVapor_massStream_leavingNode(hourlyWaterVaporVolume, hourlyClinkerProduction){
    let waterVaporMassStream = (hourlyWaterVaporVolume * waterVaporDensity) / hourlyClinkerProduction;
    return waterVaporMassStream;
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// 4.离开节点的能量总和
function cal_total_energyStream_leavingNode(hourlyWasteGasVolume, hourlyClinkerProduction, hourlyWaterVaporVolume, averageWasterGasSpecificHeat, wasterGasTemperaturePH, ashConcentration, ashSpecificHeat){
    let wasterGasSensible = cal_wasterGas_sensible_leavingNode(hourlyWasteGasVolume, hourlyClinkerProduction, averageWasterGasSpecificHeat, wasterGasTemperaturePH);
    let ashSensible = cal_Ash_sensible_leavingNode(ashConcentration, hourlyWasteGasVolume, hourlyClinkerProduction, ashSpecificHeat, wasterGasTemperaturePH);
    let waterVaporSensible = cal_waterVapor_sensible_leavingNode(hourlyWaterVaporVolume, hourlyClinkerProduction);

    let totalLeavingSensible = wasterGasSensible + ashSensible + waterVaporSensible;
    return totalLeavingSensible;
}
// 4-1.离开的废气显热
function cal_wasterGas_sensible_leavingNode(hourlyWasteGasVolume, hourlyClinkerProduction, averageWasterGasSpecificHeat, wasterGasTemperaturePH){
    let wasterGasSensible;
    wasterGasSensible = hourlyWasteGasVolume * averageWasterGasSpecificHeat * wasterGasTemperaturePH / hourlyClinkerProduction;
    return wasterGasSensible;
}
// 4-2.离开的飞灰显热
function cal_Ash_sensible_leavingNode(ashConcentration, hourlyWasteGasVolume, hourlyClinkerProduction, ashSpecificHeat, wasterGasTemperaturePH){
    let ashMassStream = cal_Ash_massStream_enteringNode(ashConcentration, hourlyWasteGasVolume, hourlyClinkerProduction);
    let ashSensible = ashMassStream * ashSpecificHeat * wasterGasTemperaturePH;
    return ashSensible;
}
// 4-3.离开的水蒸气显热
function cal_waterVapor_sensible_leavingNode(hourlyWaterVaporVolume, hourlyClinkerProduction){
    let waterVaporSensible = hourlyWaterVaporVolume * waterVaporSpecificHeat * waterVaporTemperature / hourlyClinkerProduction;
    return waterVaporSensible;
}