// 分解炉的热量收支计算方程流程
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
const standardAirSpecificHeat = 1009;
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
const rawMaterialSpecificHeat = 100;
//---------------------------------------------------------------------------------------------
// 温度常量
const waterVaporTemperature = 100;
// 流程执行函数

// 1.进入节点的物质流总量
export function fun2(
    hourlyCoalPowder,
    hourlyClinkerProduction,
    hourlyFirstAirVolume,
    hourlyThirdAirVolume,
    hourlyRawMaterial,
    hourlyLeakageVolume,
    hourlyWasterGasVolume,
    hourlyAshVolume,
    coalPowderTemperature,
    firstAirTemperature,
    thirdAirTemperature,
    airTemperature,
    wasterGasTemperature,
    ashTemperature,
    rawMaterialTemperature,
    waterContent,
    magnesiumOxideContent,
    calciumOxideContent,
    rawMaterialWaterContent,
    ashLoss,
    rawMaterialLoss,
    ashDensity,
    coalHeatingValue
){
    let totalEnteringMassStream = cal_total_massStream_enteringNode(hourlyCoalPowder, hourlyClinkerProduction, hourlyFirstAirVolume, hourlyThirdAirVolume, hourlyRawMaterial, hourlyLeakageVolume, hourlyWasterGasVolume, hourlyAshVolume, ashDensity)
    let totalEnteringSensible = cal_total_sensible_enteringNode(hourlyCoalPowder, hourlyClinkerProduction, hourlyFirstAirVolume, hourlyThirdAirVolume, hourlyLeakageVolume, hourlyAshVolume, coalHeatingValue, ashDensity, rawMaterialWaterContent, coalPowderTemperature, firstAirTemperature, thirdAirTemperature, airTemperature, wasterGasTemperature, ashTemperature, rawMaterialTemperature)
    let totalLeavingMassStream = cal_total_massStream_leavingNode(hourlyCoalPowder, hourlyWasterGasVolume, hourlyAshVolume, hourlyClinkerProduction, ashDensity)
    let totalLeavingSensible = cal_total_energyStream_leavingNode(hourlyRawMaterial, hourlyClinkerProduction, rawMaterialTemperature, hourlyAshVolume, wasterGasTemperature, ashDensity, ashTemperature, ashLoss, rawMaterialLoss, waterContent, magnesiumOxideContent, calciumOxideContent)

    // 可计算物质流损失比和热效率
    let massStreamRatio = totalLeavingMassStream / totalEnteringMassStream * 100;
    let thermalEfficiency = totalLeavingSensible / totalEnteringSensible * 100;

    return [massStreamRatio, thermalEfficiency];
}

function cal_total_massStream_enteringNode(
    hourlyCoalPowder,
    hourlyClinkerProduction,
    hourlyFirstAirVolume,
    hourlyThirdAirVolume,
    hourlyRawMaterial,
    hourlyLeakageVolume,
    hourlyWasterGasVolume,
    hourlyAshVolume,
    ashDensity
){
    let coalPowderMassStream = cal_coalPowder_massStream_enteringNode(hourlyCoalPowder, hourlyClinkerProduction)
    let firstAirMassStream = cal_firstAir_massStream_enteringNode(hourlyFirstAirVolume, hourlyClinkerProduction)
    let thirdAirMassStream = cal_thirdAir_massStream_enteringNode(hourlyThirdAirVolume, hourlyClinkerProduction)
    let rawMaterialMassStream = cal_rawMaterial_massStream_enteringNode(hourlyRawMaterial, hourlyClinkerProduction)
    let leakageMassStream = cal_leakage_massStream_enteringNode(hourlyLeakageVolume, hourlyClinkerProduction)
    let wasterGasMassStream = cal_wasterGas_massStream_enteringNode(hourlyWasterGasVolume, hourlyClinkerProduction)
    let ashMassStream = cal_ash_massStream_enteringNode(hourlyAshVolume, hourlyClinkerProduction, ashDensity)

    let totalEnteringNodeMassStream = coalPowderMassStream + firstAirMassStream + thirdAirMassStream + rawMaterialMassStream + leakageMassStream + wasterGasMassStream + ashMassStream;
    return totalEnteringNodeMassStream;
}
// 1-1:煤粉进入的物质流
function cal_coalPowder_massStream_enteringNode(hourlyCoalPowder, hourlyClinkerProduction){
    let coalPowderMassStream = hourlyCoalPowder / hourlyClinkerProduction;
    return coalPowderMassStream;
}
// 1-2:一次空气的物质流
function cal_firstAir_massStream_enteringNode(hourlyFirstAirVolume, hourlyClinkerProduction){
    let firstAirDensity = (
        carbonMonoxideDensity * carbonMonoxideVolumeFractionFirst +
        carbonDioxideDensity * carbonDioxideVolumeFractionFirst+
        waterVaporDensity * waterVaporVolumeFractionFirst +
        oxygenDensity * oxygenVolumeFractionFirst +
        nitrogenDensity * nitrogenVolumeFractionFirst
    ) / 100;

    let firstAirMassStream = hourlyFirstAirVolume * firstAirDensity / hourlyClinkerProduction;
    return firstAirMassStream;
}
// 1-3:三次空气的物质流
function cal_thirdAir_massStream_enteringNode(hourlyThirdAirVolume, hourlyClinkerProduction){
    let thirdAirDensity = (
        carbonMonoxideDensity * carbonMonoxideVolumeFractionThird +
        carbonDioxideDensity * carbonDioxideVolumeFractionThird+
        waterVaporDensity * waterVaporVolumeFractionThird +
        oxygenDensity * oxygenVolumeFractionThird +
        nitrogenDensity * nitrogenVolumeFractionThird
    ) / 100;

    let thirdAirMassStream = hourlyThirdAirVolume * thirdAirDensity / hourlyClinkerProduction;
    return thirdAirMassStream;
}
// 1-4:出口生料的物质流
function cal_rawMaterial_massStream_enteringNode(hourlyRawMaterial, hourlyClinkerProduction){
    let rawMaterialMassStream = hourlyRawMaterial / hourlyClinkerProduction;
    return rawMaterialMassStream;
}
// 1-5:漏风的物质流
function cal_leakage_massStream_enteringNode(hourlyLeakageVolume, hourlyClinkerProduction){
    // 使用标准空气的密度
    let leakageMassStream = hourlyLeakageVolume * standardAirDensity / hourlyClinkerProduction;
    return leakageMassStream;
}
// 1-6:窑尾的废气的物质流
function cal_wasterGas_massStream_enteringNode(hourlyWasterGasVolume, hourlyClinkerProduction){
    let wasterGasDensity = (
        carbonMonoxideDensity * carbonMonoxideVolumeFractionWasterGas +
        carbonDioxideDensity * carbonDioxideVolumeFractionWasterGas+
        waterVaporDensity * waterVaporVolumeFractionWasterGas +
        oxygenDensity * oxygenVolumeFractionWasterGas +
        nitrogenDensity * nitrogenVolumeFractionWasterGas
    ) / 100;

    let wasterGasMassStream = hourlyWasterGasVolume * wasterGasDensity / hourlyClinkerProduction;
    return wasterGasMassStream
}
// 1-7:窑尾的飞灰的物质流
function cal_ash_massStream_enteringNode(hourlyAshVolume, hourlyClinkerProduction, ashDensity){
    let ashMassStream = hourlyAshVolume * ashDensity / hourlyClinkerProduction;
    return ashMassStream;
}
// 2.进入冷却炉的能量流
function cal_total_sensible_enteringNode(
    hourlyCoalPowder,
    hourlyClinkerProduction,
    hourlyFirstAirVolume,
    hourlyThirdAirVolume,
    hourlyLeakageVolume,
    hourlyAshVolume, coalHeatingValue, ashDensity,
    rawMaterialWaterContent,
    coalPowderTemperature,
    firstAirTemperature,
    thirdAirTemperature,
    airTemperature,
    wasterGasTemperature,
    ashTemperature,
    rawMaterialTemperature
){
    let coalPowderSensible = cal_coalPowder_sensible_enteringNode(hourlyCoalPowder, hourlyClinkerProduction, coalPowderTemperature);
    let firstAirSensible = cal_firstAir_sensible_enteringNode(hourlyFirstAirVolume, hourlyClinkerProduction, firstAirTemperature);
    let thirdAirSensible = cal_thirdAir_sensible_enteringNode(hourlyThirdAirVolume, hourlyClinkerProduction, thirdAirTemperature);
    let rawMaterialSensible = cal_rawMaterial_sensible_enteringNode(rawMaterialTemperature, rawMaterialWaterContent);
    let leakageSensible = cal_leakage_sensible_enteringNode(hourlyLeakageVolume, hourlyClinkerProduction, airTemperature)
    let coalPowderBurningSensible = cal_coalPowderBurning_sensible_enteringNode(hourlyCoalPowder, hourlyClinkerProduction, coalHeatingValue)
    let wasterGasSensible = cal_wasterGas_sensible_enteringNode(hourlyAshVolume, hourlyClinkerProduction, wasterGasTemperature)
    let ashSensible = cal_ash_sensible_enteringNode(hourlyAshVolume, hourlyClinkerProduction, ashDensity, ashTemperature)

    let totalEnteringNodeSensible = coalPowderSensible + firstAirSensible + thirdAirSensible + rawMaterialSensible + leakageSensible + coalPowderBurningSensible + wasterGasSensible + ashSensible
    return totalEnteringNodeSensible;
}
// 2-1
function cal_coalPowder_sensible_enteringNode(hourlyCoalPowder, hourlyClinkerProduction, coalPowderTemperature){
    let coalPowderMassStream = cal_coalPowder_massStream_enteringNode(hourlyCoalPowder, hourlyClinkerProduction);
    let coalPowderSensible = coalPowderMassStream * coalPowderSpecificHeat * coalPowderTemperature;
    return coalPowderSensible;
}
// 2-2
function cal_firstAir_sensible_enteringNode(hourlyFirstAirVolume, hourlyClinkerProduction, firstAirTemperature){
    let firstAirSpecificHeat = (
        (carbonMonoxideVolumeFractionFirst * carbonMonoxideSpecificHeatFirst) +
        (carbonDioxideVolumeFractionFirst * carbonDioxideSpecificHeatFirst) +
        (waterVaporVolumeFractionFirst * waterVaporSpecificHeatFirst) +
        (oxygenVolumeFractionFirst * oxygenSpecificHeatFirst) +
        (nitrogenVolumeFractionFirst * nitrogenSpecificHeatFirst)) / 100;

    let firstAirSensible = hourlyFirstAirVolume * firstAirSpecificHeat * firstAirTemperature / hourlyClinkerProduction;
    return firstAirSensible;
}
// 2-3
function cal_thirdAir_sensible_enteringNode(hourlyThirdAirVolume, hourlyClinkerProduction, thirdAirTemperature){
    let thirdAirSpecificHeat = (
        (carbonMonoxideVolumeFractionThird * carbonMonoxideSpecificHeatThird) +
        (carbonDioxideVolumeFractionThird * carbonDioxideSpecificHeatThird) +
        (waterVaporVolumeFractionThird * waterVaporSpecificHeatThird) +
        (oxygenVolumeFractionThird * oxygenSpecificHeatThird) +
        (nitrogenVolumeFractionThird * nitrogenSpecificHeatThird)) / 100;

    let thirdAirSensible = hourlyThirdAirVolume * thirdAirSpecificHeat * thirdAirTemperature / hourlyClinkerProduction;
    return thirdAirSensible;
}
// 2-4
function cal_rawMaterial_sensible_enteringNode(rawMaterialTemperature, rawMaterialWaterContent){
    // rawMaterialTemperature : 生料的温度
    let rawMaterialSensible = (0.88 + 2.93e4 * rawMaterialTemperature) + 4.1816 * (rawMaterialWaterContent / (100 - rawMaterialWaterContent));
    return rawMaterialSensible;
}
// 2-5:漏风显热
function cal_leakage_sensible_enteringNode(hourlyLeakageVolume, hourlyClinkerProduction, airTemperature){
    let leakageSensible = hourlyLeakageVolume / hourlyClinkerProduction * standardAirSpecificHeat * airTemperature;
    return leakageSensible;
}
// 2-6
function cal_coalPowderBurning_sensible_enteringNode(hourlyCoalPowder, hourlyClinkerProduction, coalHeatingValue){
    // coalHeatingValue: 人分解炉煤粉收到基低位发热量
    let coalPowderMassStream = cal_coalPowder_massStream_enteringNode(hourlyCoalPowder, hourlyClinkerProduction)
    let coalPowderBurningSensible = coalPowderMassStream * coalHeatingValue;
    return coalPowderBurningSensible;
}
// 2-7 废气显热
function cal_wasterGas_sensible_enteringNode(hourlyAshVolume, hourlyClinkerProduction, wasterGasTemperature){
    let wasterGasSpecificHeat = (
        (carbonMonoxideVolumeFractionWasterGas * carbonMonoxideSpecificHeatWasterGas) +
        (carbonDioxideVolumeFractionWasterGas * carbonDioxideSpecificHeatWasterGas) +
        (waterVaporVolumeFractionWasterGas * waterVaporSpecificHeatWasterGas) +
        (oxygenVolumeFractionWasterGas * oxygenSpecificHeatWasterGas) +
        (nitrogenVolumeFractionWasterGas * nitrogenSpecificHeatWasterGas)) / 100;

    let wasterGasSensible = hourlyAshVolume * wasterGasSpecificHeat * wasterGasTemperature / hourlyClinkerProduction;
    return wasterGasSensible;
}
// 2-8 飞灰显热
function cal_ash_sensible_enteringNode(hourlyAshVolume, hourlyClinkerProduction, ashDensity, ashTemperature){
    let ashMassStream = cal_ash_massStream_enteringNode(hourlyAshVolume, hourlyClinkerProduction, ashDensity);
    let ashSensible = ashMassStream * ashSpecificHeat * ashTemperature;
    return ashSensible;
}
// 3.离开冷却炉的物质流
function cal_total_massStream_leavingNode(
    hourlyCoalPowder,
    hourlyWasterGasVolume,
    hourlyAshVolume,
    hourlyClinkerProduction,
    ashDensity){
    let coalPowderMassStream = cal_coalPowder_massStream_leavingNode(hourlyCoalPowder, hourlyClinkerProduction)
    let wasterGasMassStream = cal_wasterGas_massStream_leavingNode(hourlyWasterGasVolume, hourlyClinkerProduction);
    let ashMassStream = cal_ash_massStream_leavingNode(hourlyAshVolume, hourlyClinkerProduction, ashDensity);

    let totalLeavingNodeMassStream = coalPowderMassStream + wasterGasMassStream + ashMassStream;
    return totalLeavingNodeMassStream;
}
// 3-1:煤粉
function cal_coalPowder_massStream_leavingNode(hourlyCoalPowder, hourlyClinkerProduction){
    let coalPowderMassStream = hourlyCoalPowder / hourlyClinkerProduction;
    return coalPowderMassStream;
}
// 3-2:废气
function cal_wasterGas_massStream_leavingNode(hourlyWasterGasVolume, hourlyClinkerProduction){
    let wasterGasDensity = (
        carbonMonoxideDensity * carbonMonoxideVolumeFractionWasterGas +
        carbonDioxideDensity * carbonDioxideVolumeFractionWasterGas+
        waterVaporDensity * waterVaporVolumeFractionWasterGas +
        oxygenDensity * oxygenVolumeFractionWasterGas +
        nitrogenDensity * nitrogenVolumeFractionWasterGas
    ) / 100;

    let wasterGasMassStream = hourlyWasterGasVolume * wasterGasDensity / hourlyClinkerProduction;
    return wasterGasMassStream;
}
// 3-3:飞灰
function cal_ash_massStream_leavingNode(hourlyAshVolume, hourlyClinkerProduction, ashDensity){
    let ashMassStream = hourlyAshVolume * ashDensity / hourlyClinkerProduction;
    return ashMassStream;
}
// 4.离开冷却炉的能量流
function cal_total_energyStream_leavingNode(
    hourlyRawMaterial,
    hourlyClinkerProduction,
    rawMaterialTemperature,
    hourlyAshVolume,
    wasterGasTemperature,
    ashDensity,
    ashTemperature,
    ashLoss,
    rawMaterialLoss,
    waterContent,
    magnesiumOxideContent,
    calciumOxideContent
){
    let rawMaterialSensible = cal_rawMaterial_sensible_leavingNode(hourlyRawMaterial, hourlyClinkerProduction, rawMaterialTemperature);
    let wasterGasSensible = cal_wasterGas_sensible_leavingNode(hourlyAshVolume, hourlyClinkerProduction, wasterGasTemperature);
    let ashSensible = cal_ash_sensible_leavingNode(hourlyAshVolume, hourlyClinkerProduction, ashDensity, ashTemperature);
    let ashDehydrationAndDecompositionHeatSensible = cal_ashDehydrationAndDecompositionHeat_sensible_leavingNode(hourlyAshVolume, hourlyClinkerProduction, ashDensity, ashLoss, rawMaterialLoss, waterContent, magnesiumOxideContent, calciumOxideContent)
    let coalPowderBurningSensible = cal_coalPowderBurning_sensible_leavingNode(hourlyCoalPowder, hourlyClinkerProduction);

    let totalLeavingSensible = rawMaterialSensible + wasterGasSensible + ashSensible + ashDehydrationAndDecompositionHeatSensible + coalPowderBurningSensible;
    return totalLeavingSensible;
}
// 4-1: 生料显热
function cal_rawMaterial_sensible_leavingNode(hourlyRawMaterial, hourlyClinkerProduction, rawMaterialTemperature){
    let rawMaterialMassStream = cal_rawMaterial_massStream_enteringNode(hourlyRawMaterial, hourlyClinkerProduction)
    let rawMaterialSensible = rawMaterialMassStream * rawMaterialSpecificHeat * rawMaterialTemperature;
    return rawMaterialSensible;
}
// 4-2: 废气显热
function cal_wasterGas_sensible_leavingNode(hourlyAshVolume, hourlyClinkerProduction, wasterGasTemperature){
    let wasterGasSpecificHeat = (
        (carbonMonoxideVolumeFractionWasterGas * carbonMonoxideSpecificHeatWasterGas) +
        (carbonDioxideVolumeFractionWasterGas * carbonDioxideSpecificHeatWasterGas) +
        (waterVaporVolumeFractionWasterGas * waterVaporSpecificHeatWasterGas) +
        (oxygenVolumeFractionWasterGas * oxygenSpecificHeatWasterGas) +
        (nitrogenVolumeFractionWasterGas * nitrogenSpecificHeatWasterGas)) / 100;

    let wasterGasSensible = hourlyAshVolume * wasterGasSpecificHeat * wasterGasTemperature / hourlyClinkerProduction;
    return wasterGasSensible;
}
// 4-3 飞灰显热
function cal_ash_sensible_leavingNode(hourlyAshVolume, hourlyClinkerProduction, ashDensity, ashTemperature){
    let ashMassStream = cal_ash_massStream_enteringNode(hourlyAshVolume, hourlyClinkerProduction, ashDensity);
    let ashSensible = ashMassStream * ashSpecificHeat * ashTemperature;
    return ashSensible;
}
// 4-4 飞灰脱水和碳酸盐分解热
function cal_ashDehydrationAndDecompositionHeat_sensible_leavingNode(
    hourlyAshVolume, hourlyClinkerProduction, ashDensity,
    ashLoss,
    rawMaterialLoss,
    waterContent,
    magnesiumOxideContent,
    calciumOxideContent
){
    let ashDehydrationAndDecompositionHeatSensible;

    let carbonDioxideContent = ((calciumOxideContent / 100) * (44 / 56)) + ((magnesiumOxideContent / 100) * (44 / 40.3));
    let ashMassStream = cal_ash_massStream_enteringNode(hourlyAshVolume, hourlyClinkerProduction, ashDensity);
    ashDehydrationAndDecompositionHeatSensible = ashMassStream * ((100-ashLoss) / (100-rawMaterialLoss)) * (waterContent / 100) * 6690 +
        (ashMassStream * ((100-ashLoss) / (100-rawMaterialLoss)) - ashMassStream * carbonDioxideContent / 100) * (100 / 44) * 1660;

    return ashDehydrationAndDecompositionHeatSensible;
}
// 4-5 煤粉的燃烧
function cal_coalPowderBurning_sensible_leavingNode(hourlyCoalPowder, hourlyClinkerProduction){
    let coalPowderBurningSensible = hourlyCoalPowder / hourlyClinkerProduction * carbonMonoxideVolumeFractionWasterGas / 100 * 12630;
    return coalPowderBurningSensible;
}
