// 冷却机的热量收支计算方程流程
// 部分常量定义
//////////////////////////////////////////////////////////////////////////////////////////////
// 各个一次空气的体积分数
const carbonMonoxideVolumeFractionSecond = 0.1;
const carbonDioxideVolumeFractionSecond = 0.1;
const waterVaporVolumeFractionSecond = 0.1;
const oxygenVolumeFractionSecond = 0.2;
const nitrogenVolumeFractionSecond = 0.2;
// 各个三次空气的体积分数
const carbonMonoxideVolumeFractionThird = 0.1;
const carbonDioxideVolumeFractionThird = 0.1;
const waterVaporVolumeFractionThird = 0.1;
const oxygenVolumeFractionThird = 0.2;
const nitrogenVolumeFractionThird = 0.2;
//////////////////////////////////////////////////////////////////////////////////////////////
// 各个气体的常压下密度
const carbonMonoxideDensity = 1.14;
const carbonDioxideDensity = 1.98;
const waterVaporDensity = 0.6;
const oxygenDensity = 1.429;
const nitrogenDensity = 0.81;
const standardAirDensity = 1.293; // 标准情况下的空气密度
//---------------------------------------------------------------------------------------------
// 各个一次空气的比热
const carbonMonoxideSpecificHeatSecond = 1040;
const carbonDioxideSpecificHeatSecond = 840;
const waterVaporSpecificHeatSecond = 1850;
const oxygenSpecificHeatSecond = 918;
const nitrogenSpecificHeatSecond = 1040;
// 各个三次空气的比热
const carbonMonoxideSpecificHeatThird = 1040;
const carbonDioxideSpecificHeatThird = 840;
const waterVaporSpecificHeatThird = 1850;
const oxygenSpecificHeatThird = 918;
const nitrogenSpecificHeatThird = 1040;

const ashSpecificHeat = 1200;
// 熟料的比热
const clinkerSpecificHeat = 1200;
//---------------------------------------------------------------------------------------------
// 流程执行函数

// 1.进入节点的物质流总量
export function fun5(
    hourlyAirVolume,
    hourlyClinkerProduction,
    hourlyWasterGasVolume,
    hourlyCoalMillAirVolume,
    hourlySecondAirVolume,
    hourlyThirdAirVolume,
    hourlyAQCAirVolume,
    ashDensity,
    airDensity,
    coolingMachineAshMassStream,
    airSpecificHeat,
    airTemperature,
    clinkerTemperature,
    secondAirTemperature,
    thirdAirTemperature
){
    let totalEnteringMassStream = cal_total_massStream_enteringNode(hourlyAirVolume, hourlyClinkerProduction)
    let totalEnteringSensible = cal_total_sensible_enteringNode(hourlyAirVolume, hourlyClinkerProduction, airSpecificHeat, airTemperature, clinkerTemperature)
    let totalLeavingMassStream = cal_total_massStream_leavingNode(
        hourlyWasterGasVolume,
        hourlyClinkerProduction,
        hourlyCoalMillAirVolume,
        hourlySecondAirVolume,
        hourlyThirdAirVolume,
        hourlyAQCAirVolume,
        ashDensity,
        airDensity,
        coolingMachineAshMassStream
    )
    let totalLeavingSensible = cal_total_sensible_leavingNode(
        hourlyClinkerProduction,
        hourlySecondAirVolume,
        hourlyThirdAirVolume,
        hourlyAQCAirVolume,
        hourlyCoalMillAirVolume,
        coolingMachineAshMassStream,
        airSpecificHeat,
        airTemperature,
        clinkerTemperature,
        secondAirTemperature,
        thirdAirTemperature
    )
    // 可计算物质流损失比和热效率
    let massStreamRatio = totalLeavingMassStream / totalEnteringMassStream * 100;
    let thermalEfficiency = totalLeavingSensible / totalEnteringSensible * 100;

    return [massStreamRatio, thermalEfficiency];
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
// 2
function cal_total_sensible_enteringNode(hourlyAirVolume, hourlyClinkerProduction, airSpecificHeat, airTemperature, clinkerTemperature){
    let clinkerSensible = cal_clinker_sensible_enteringNode(clinkerTemperature)
    let airSensible = cal_air_sensible_enteringNode(hourlyAirVolume, hourlyClinkerProduction, airSpecificHeat, airTemperature)
    let totalEnteringSensible = clinkerSensible + airSensible
    return totalEnteringSensible
}
// 2-1: 高温水泥熟料的显热
function cal_clinker_sensible_enteringNode(clinkerTemperature){
    let clinkerSensible = clinkerSpecificHeat * clinkerTemperature;
    return clinkerSensible
}
// 2-2: 冷却空气的显热
function cal_air_sensible_enteringNode(hourlyAirVolume, hourlyClinkerProduction, airSpecificHeat,  airTemperature){
    let airSensible = hourlyAirVolume * airTemperature * airSpecificHeat / hourlyClinkerProduction
    return airSensible
}

function cal_total_massStream_leavingNode(
    hourlyWasterGasVolume,
    hourlyClinkerProduction,
    hourlyCoalMillAirVolume,
    hourlySecondAirVolume,
    hourlyThirdAirVolume,
    hourlyAQCAirVolume,
    ashDensity,
    airDensity,
    coolingMachineAshMassStream
){
    let clinkerMassStream = cal_clinker_massStream_leavingNode(coolingMachineAshMassStream)
    let ashMassStream = cal_ash_massStream_leavingNode(hourlyWasterGasVolume, ashDensity, hourlyClinkerProduction)
    let airMassStream = cal_air_massStream_leavingNode(hourlyCoalMillAirVolume, hourlyClinkerProduction, airDensity)
    let secondAirMassStream = cal_secondAir_massStream_leavingNode(hourlySecondAirVolume, hourlyClinkerProduction)
    let thirdAirMassStream = cal_thirdAir_massStream_leavingNode(hourlyThirdAirVolume, hourlyClinkerProduction)
    let AQCAirMassStream = cal_AQCAir_massStream_leavingNode(hourlyAQCAirVolume, hourlyClinkerProduction, airDensity)

    let totalLeavingNodeMassStream = clinkerMassStream + ashMassStream + airMassStream + secondAirMassStream + thirdAirMassStream + AQCAirMassStream
    return totalLeavingNodeMassStream
}
// 3-1: 低温水泥熟料的物质流
function cal_clinker_massStream_leavingNode(coolingMachineAshMassStream){
    let clinkerMassStream = 1 - coolingMachineAshMassStream;
    return clinkerMassStream;
}
// 3-2: 飞灰的物质流
function cal_ash_massStream_leavingNode(hourlyWasterGasVolume, ashDensity, hourlyClinkerProduction){
    let ashMassStream = hourlyWasterGasVolume * ashDensity / hourlyClinkerProduction;
    return ashMassStream
}
// 3-3: 冷却空气的物质流
function cal_air_massStream_leavingNode(hourlyCoalMillAirVolume, hourlyClinkerProduction, airDensity){
    let airMassStream = hourlyCoalMillAirVolume * airDensity / hourlyClinkerProduction;
    return airMassStream
}
// 3-4: 二次空气
function cal_secondAir_massStream_leavingNode(hourlySecondAirVolume, hourlyClinkerProduction){
    let secondAirDensity = (
        carbonMonoxideDensity * carbonMonoxideVolumeFractionSecond +
        carbonDioxideDensity * carbonDioxideVolumeFractionSecond+
        waterVaporDensity * waterVaporVolumeFractionSecond +
        oxygenDensity * oxygenVolumeFractionSecond +
        nitrogenDensity * nitrogenVolumeFractionSecond
    ) / 100;

    let secondAirMassStream = hourlySecondAirVolume * secondAirDensity / hourlyClinkerProduction;
    return secondAirMassStream;
}
// 3-5: 三次空气
function cal_thirdAir_massStream_leavingNode(hourlyThirdAirVolume, hourlyClinkerProduction){
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
// 3-6: AQC空气
function cal_AQCAir_massStream_leavingNode(hourlyAQCAirVolume, hourlyClinkerProduction, airDensity){
    let AQCAirMassStream = hourlyAQCAirVolume * airDensity / hourlyClinkerProduction;
    return AQCAirMassStream;
}

function cal_total_sensible_leavingNode(
    hourlyClinkerProduction,
    hourlySecondAirVolume,
    hourlyThirdAirVolume,
    hourlyAQCAirVolume,
    hourlyCoalMillAirVolume,
    coolingMachineAshMassStream,
    airSpecificHeat,
    airTemperature,
    clinkerTemperature,
    secondAirTemperature,
    thirdAirTemperature
){
    let clinkerSensible = cal_clinker_sensible_leavingNode(coolingMachineAshMassStream, clinkerSpecificHeat, clinkerTemperature)
    let ashSensible = cal_ash_sensible_leavingNode(coolingMachineAshMassStream, ashSpecificHeat, airTemperature)
    let secondAirSensible = cal_second_sensible_leavingNode(hourlySecondAirVolume, hourlyClinkerProduction, secondAirTemperature)
    let thirdAirSensible = cal_thirdAir_sensible_leavingNode(hourlyThirdAirVolume, hourlyClinkerProduction, thirdAirTemperature)
    let airSensible = cal_air_sensible_leavingNode(hourlyCoalMillAirVolume, airSpecificHeat, hourlyClinkerProduction, airTemperature)
    let AQCAirSensible = cal_AQCAir_sensible_leavingNode(hourlyAQCAirVolume, hourlyClinkerProduction, airSpecificHeat, airTemperature)
    let totalLeavingNodeSensible = clinkerSensible + ashSensible + secondAirSensible + thirdAirSensible + airSensible + AQCAirSensible
    return totalLeavingNodeSensible
}
// 4-1: 低温水泥显热
function cal_clinker_sensible_leavingNode(coolingMachineAshMassStream, clinkerSpecificHeat, clinkerTemperature){
    let clinkerSensible = (1 - coolingMachineAshMassStream) * clinkerSpecificHeat * clinkerTemperature
    return clinkerSensible
}
// 4-2: 飞灰显热
function cal_ash_sensible_leavingNode(coolingMachineAshMassStream, ashSpecificHeat, airTemperature){
    let ashSensible = coolingMachineAshMassStream * ashSpecificHeat * airTemperature;
    return ashSensible;
}
// 4-3: 二次空气显热
function cal_second_sensible_leavingNode(hourlySecondAirVolume, hourlyClinkerProduction, secondAirTemperature){
    let secondAirSpecificHeat = (
        (carbonMonoxideVolumeFractionSecond * carbonMonoxideSpecificHeatSecond) +
        (carbonDioxideVolumeFractionSecond * carbonDioxideSpecificHeatSecond) +
        (waterVaporVolumeFractionSecond * waterVaporSpecificHeatSecond) +
        (oxygenVolumeFractionSecond * oxygenSpecificHeatSecond) +
        (nitrogenVolumeFractionSecond * nitrogenSpecificHeatSecond)) / 100;

    let secondAirSensible = hourlySecondAirVolume * secondAirSpecificHeat * secondAirTemperature / hourlyClinkerProduction;
    return secondAirSensible;
}
// 4-4: 三次空气显热
function cal_thirdAir_sensible_leavingNode(hourlyThirdAirVolume, hourlyClinkerProduction, thirdAirTemperature){
    let thirdAirSpecificHeat = (
        (carbonMonoxideVolumeFractionThird * carbonMonoxideSpecificHeatThird) +
        (carbonDioxideVolumeFractionThird * carbonDioxideSpecificHeatThird) +
        (waterVaporVolumeFractionThird * waterVaporSpecificHeatThird) +
        (oxygenVolumeFractionThird * oxygenSpecificHeatThird) +
        (nitrogenVolumeFractionThird * nitrogenSpecificHeatThird)) / 100;

    let thirdAirSensible = hourlyThirdAirVolume * thirdAirSpecificHeat * thirdAirTemperature / hourlyClinkerProduction;
    return thirdAirSensible;
}
// 4-5: 冷却机空气显热
function cal_air_sensible_leavingNode(hourlyCoalMillAirVolume, airSpecificHeat, hourlyClinkerProduction, airTemperature){
    let airSensible = hourlyCoalMillAirVolume * airSpecificHeat * airTemperature / hourlyClinkerProduction;
    return airSensible;
}
// 4-6: AQC空气显热
function cal_AQCAir_sensible_leavingNode(hourlyAQCAirVolume, hourlyClinkerProduction, airSpecificHeat, airTemperature){
    let AQCAirSensible = hourlyAQCAirVolume * airSpecificHeat * airTemperature / hourlyClinkerProduction
    return AQCAirSensible
}