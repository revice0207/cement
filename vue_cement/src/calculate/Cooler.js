// 冷却机的热量收支计算方程流程
// 部分常量定义
//////////////////////////////////////////////////////////////////////////////////////////////
// 各个一次空气的体积分数
// const carbonMonoxideVolumeFractionSecond = 0.1;
// const carbonDioxideVolumeFractionSecond = 0.1;
// const waterVaporVolumeFractionSecond = 0.1;
// const oxygenVolumeFractionSecond = 0.2;
// const nitrogenVolumeFractionSecond = 0.2;
// 各个三次空气的体积分数
// const carbonMonoxideVolumeFractionThird = 0.1;
// const carbonDioxideVolumeFractionThird = 0.1;
// const waterVaporVolumeFractionThird = 0.1;
// const oxygenVolumeFractionThird = 0.2;
// const nitrogenVolumeFractionThird = 0.2;
//////////////////////////////////////////////////////////////////////////////////////////////
// 各个气体的常压下密度
// const carbonMonoxideDensity = 1.14;
// const carbonDioxideDensity = 1.98;
// /const waterVaporDensity = 0.6;
// const oxygenDensity = 1.429;
// cons/t nitrogenDensity = 0.81;
const standardAirDensity = 1.293; // 标准情况下的空气密度
//---------------------------------------------------------------------------------------------
// 各个一次空气的比热
const standardAirSpecificHeat = 100;
// const carbonMonoxideSpecificHeatSecond = 1040;
// const carbonDioxideSpecificHeatSecond = 840;
// const waterVaporSpecificHeatSecond = 1850;
// const oxygenSpecificHeatSecond = 918;
// const nitrogenSpecificHeatSecond = 1040;
// 各个三次空气的比热
// const carbonMonoxideSpecificHeatThird = 1040;
// const carbonDioxideSpecificHeatThird = 840;
// const waterVaporSpecificHeatThird = 1850;
// const oxygenSpecificHeatThird = 918;
// const nitrogenSpecificHeatThird = 1040;

// const ashSpecificHeat = 1200;
// 熟料的比热
// const clinkerSpecificHeat = 1200;
//---------------------------------------------------------------------------------------------
// 流程执行函数

// 1.进入节点的物质流总量
export function fun5(
	hourlyAirVolume,
	hourlyCoolerWater,
	coolerWaterTemperature,
	airTemperature,
	hourlyExcludeAirVolume,
	ExcludeAirTemperature,
	ashContent,
	hourlyCoalMillAirVolume,
	CoalMillAirTemperature,
	hourlyAQCAirVolume,
	AQCAirTemperature,
	clinkerTemperature,
	thirdAirTemperature,
	coolerWaterOutTemperature,
	hourlySteamedWater,
    waterSpecificHeat,
	clinkerSpecificHeat,
	ashSpecificHeat,
    SecondDustContent, 
	ThirdDustContent, 
	hourlyClinkerProduction, 
	ashDensity, 
	hourlySecondAirVolume, 
	carbonMonoxideDensitySecond, 
	carbonDioxideDensitySecond, 
	oxygenDensitySecond, 
	nitrogenDensitySecond, 
	carbonMonoxideVolumeFractionSecond, 
	carbonDioxideVolumeFractionSecond, 
	oxygenVolumeFractionSecond, 
	nitrogenVolumeFractionSecond, 
	hourlyThirdAirVolume, 
	carbonMonoxideDensityThird, 
	carbonDioxideDensityThird, 
	oxygenDensityThird, 
	nitrogenDensityThird, 
	carbonMonoxideVolumeFractionThird, 
	carbonDioxideVolumeFractionThird, 
	oxygenVolumeFractionThird, 
	nitrogenVolumeFractionThird, 
	secondAirTemperature, 
	carbonMonoxideSpecificHeatSecond, 
	carbonDioxideSpecificHeatSecond, 
	oxygenSpecificHeatSecond, 
	nitrogenSpecificHeatSecond, 
	thirdAirSpecificHeat, 
	heatOfVaporization
){
    let totalEnteringMassStream = cal_total_massStream_enteringNode(SecondDustContent, ThirdDustContent, hourlyAirVolume, hourlyClinkerProduction, hourlyCoolerWater)
    let totalEnteringSensible = cal_total_sensible_enteringNode(SecondDustContent, ThirdDustContent, clinkerSpecificHeat, clinkerTemperature, hourlyAirVolume, hourlyClinkerProduction,  airTemperature, hourlyCoolerWater, waterSpecificHeat, coolerWaterTemperature)
    let totalLeavingMassStream = cal_total_massStream_leavingNode(hourlyExcludeAirVolume, hourlyCoalMillAirVolume, hourlyAQCAirVolume, ashDensity, hourlyClinkerProduction, hourlySecondAirVolume, carbonMonoxideDensitySecond, carbonDioxideDensitySecond, oxygenDensitySecond, nitrogenDensitySecond, carbonMonoxideVolumeFractionSecond, carbonDioxideVolumeFractionSecond, oxygenVolumeFractionSecond, nitrogenVolumeFractionSecond, SecondDustContent, hourlyThirdAirVolume, ThirdDustContent, carbonMonoxideDensityThird, carbonDioxideDensityThird, oxygenDensityThird, nitrogenDensityThird, carbonMonoxideVolumeFractionThird, carbonDioxideVolumeFractionThird, oxygenVolumeFractionThird, nitrogenVolumeFractionThird, hourlyCoolerWater)
    let totalLeavingSensible = cal_total_sensible_leavingNode(hourlyExcludeAirVolume, hourlyCoalMillAirVolume, hourlyAQCAirVolume, ashDensity, hourlyClinkerProduction, clinkerSpecificHeat, clinkerTemperature, ashSpecificHeat, ExcludeAirTemperature, CoalMillAirTemperature, AQCAirTemperature, ashContent, hourlySecondAirVolume, secondAirTemperature, carbonMonoxideVolumeFractionSecond, carbonDioxideVolumeFractionSecond, oxygenVolumeFractionSecond, nitrogenVolumeFractionSecond, carbonMonoxideSpecificHeatSecond, carbonDioxideSpecificHeatSecond, oxygenSpecificHeatSecond, nitrogenSpecificHeatSecond, SecondDustContent, hourlyThirdAirVolume, thirdAirTemperature, thirdAirSpecificHeat, hourlySteamedWater, hourlyCoolerWater, coolerWaterOutTemperature, heatOfVaporization, waterSpecificHeat)
    // 可计算物质流损失比和热效率
    let massStreamRatio = totalLeavingMassStream / totalEnteringMassStream * 100;
    let thermalEfficiency = totalLeavingSensible / totalEnteringSensible * 100;

    return [massStreamRatio, thermalEfficiency, totalEnteringMassStream, totalEnteringSensible, totalLeavingMassStream, totalLeavingSensible];
}

function cal_total_massStream_enteringNode(SecondDustContent, ThirdDustContent, hourlyAirVolume, hourlyClinkerProduction, hourlyCoolerWater){
    let clinkerMassStream =  cal_clinker_massStream_enteringNode(SecondDustContent, ThirdDustContent)
    let airMassStream = cal_air_massStream_enteringNode(hourlyAirVolume, hourlyClinkerProduction)
	let coolerWaterMassStream = cal_coolerWater_massStream_enteringNode(hourlyCoolerWater, hourlyClinkerProduction)
    let totalEnteringMassStream = clinkerMassStream + airMassStream + coolerWaterMassStream
    return totalEnteringMassStream;
}
// (success)1-1: 熟料进入的物质流
function cal_clinker_massStream_enteringNode(SecondDustContent, ThirdDustContent){
	let clinkerMassStream = 1 + SecondDustContent + ThirdDustContent
    return clinkerMassStream
}
// (success)1-2: 冷却空气的物质流
function cal_air_massStream_enteringNode(hourlyAirVolume, hourlyClinkerProduction){
    let airMassStream = hourlyAirVolume * standardAirDensity / hourlyClinkerProduction;
    return airMassStream;
}
// (success)1-3:
function cal_coolerWater_massStream_enteringNode(hourlyCoolerWater, hourlyClinkerProduction){
	let coolerWaterMassStream = hourlyCoolerWater / hourlyClinkerProduction;
	return coolerWaterMassStream
}
// 2
function cal_total_sensible_enteringNode(SecondDustContent, ThirdDustContent, clinkerSpecificHeat, clinkerTemperature, hourlyAirVolume, hourlyClinkerProduction,  airTemperature, hourlyCoolerWater, waterSpecificHeat, coolerWaterTemperature){
    let clinkerSensible = cal_clinker_sensible_enteringNode(SecondDustContent, ThirdDustContent, clinkerSpecificHeat, clinkerTemperature)
    let airSensible = cal_air_sensible_enteringNode(hourlyAirVolume, hourlyClinkerProduction,  airTemperature)
	let coolerWaterSensible = cal_coolerWater_sensible_enteringNode(hourlyCoolerWater, hourlyClinkerProduction, waterSpecificHeat, coolerWaterTemperature)
    let totalEnteringSensible = clinkerSensible + airSensible + coolerWaterSensible
    return totalEnteringSensible
}
// (success)2-1: 高温水泥熟料的显热
function cal_clinker_sensible_enteringNode(SecondDustContent, ThirdDustContent, clinkerSpecificHeat, clinkerTemperature){
	let clinkerMassStream = cal_clinker_massStream_leavingNode(SecondDustContent, ThirdDustContent)
    let clinkerSensible = clinkerMassStream * clinkerSpecificHeat * clinkerTemperature;
    return clinkerSensible
}
// (success)2-2: 冷却空气的显热
function cal_air_sensible_enteringNode(hourlyAirVolume, hourlyClinkerProduction,  airTemperature){
    let airSensible = (hourlyAirVolume * airTemperature * standardAirSpecificHeat) / hourlyClinkerProduction
    return airSensible
}
// (success)2-3: 冷却水
function cal_coolerWater_sensible_enteringNode(hourlyCoolerWater, hourlyClinkerProduction, waterSpecificHeat, coolerWaterTemperature){
	let coolerWaterMassStream = cal_coolerWater_massStream_enteringNode(hourlyCoolerWater, hourlyClinkerProduction)
	let coolerWaterSensible = coolerWaterMassStream * waterSpecificHeat * coolerWaterTemperature
	return coolerWaterSensible
}
// 3
function cal_total_massStream_leavingNode(hourlyExcludeAirVolume, hourlyCoalMillAirVolume, hourlyAQCAirVolume, ashDensity, hourlyClinkerProduction, hourlySecondAirVolume, carbonMonoxideDensitySecond, carbonDioxideDensitySecond, oxygenDensitySecond, nitrogenDensitySecond, carbonMonoxideVolumeFractionSecond, carbonDioxideVolumeFractionSecond, oxygenVolumeFractionSecond, nitrogenVolumeFractionSecond, SecondDustContent, hourlyThirdAirVolume, ThirdDustContent, carbonMonoxideDensityThird, carbonDioxideDensityThird, oxygenDensityThird, nitrogenDensityThird, carbonMonoxideVolumeFractionThird, carbonDioxideVolumeFractionThird, oxygenVolumeFractionThird, nitrogenVolumeFractionThird, hourlyCoolerWater){
    let clinkerMassStream = cal_clinker_massStream_leavingNode(hourlyExcludeAirVolume, hourlyCoalMillAirVolume, hourlyAQCAirVolume, ashDensity, hourlyClinkerProduction)
    let ashMassStream = cal_ash_massStream_leavingNode(hourlyExcludeAirVolume, hourlyCoalMillAirVolume, hourlyAQCAirVolume, ashDensity, hourlyClinkerProduction)
    let airMassStream = cal_CoalMillAir_massStream_leavingNode(hourlyCoalMillAirVolume, hourlyClinkerProduction)
    let secondAirMassStream = cal_secondAir_massStream_leavingNode(hourlySecondAirVolume, hourlyClinkerProduction, carbonMonoxideDensitySecond, carbonDioxideDensitySecond, oxygenDensitySecond, nitrogenDensitySecond, carbonMonoxideVolumeFractionSecond, carbonDioxideVolumeFractionSecond, oxygenVolumeFractionSecond, nitrogenVolumeFractionSecond, SecondDustContent)
    let thirdAirMassStream = cal_thirdAir_massStream_leavingNode(hourlyThirdAirVolume, hourlyClinkerProduction, ThirdDustContent, carbonMonoxideDensityThird, carbonDioxideDensityThird, oxygenDensityThird, nitrogenDensityThird, carbonMonoxideVolumeFractionThird, carbonDioxideVolumeFractionThird, oxygenVolumeFractionThird, nitrogenVolumeFractionThird)
    let AQCAirMassStream = cal_AQCAir_massStream_leavingNode(hourlyAQCAirVolume, hourlyClinkerProduction)
	let coolerWaterMassStream = cal_coolerWater_massStream_leavingNode(hourlyCoolerWater, hourlyClinkerProduction)
    let ExcludeAirMassStream = cal_ExcludeAir_massStream_leavingNode(hourlyExcludeAirVolume, hourlyClinkerProduction)
	let totalLeavingNodeMassStream = clinkerMassStream + ashMassStream + airMassStream + secondAirMassStream + thirdAirMassStream + AQCAirMassStream + coolerWaterMassStream + ExcludeAirMassStream
    return totalLeavingNodeMassStream
}
// (success)3-1: 低温水泥熟料的物质流
function cal_clinker_massStream_leavingNode(hourlyExcludeAirVolume, hourlyCoalMillAirVolume, hourlyAQCAirVolume, ashDensity, hourlyClinkerProduction){
    let ashMassStream = cal_ash_massStream_leavingNode(hourlyExcludeAirVolume, hourlyCoalMillAirVolume, hourlyAQCAirVolume, ashDensity, hourlyClinkerProduction)
	let clinkerMassStream = 1 - ashMassStream;
    return clinkerMassStream;
}
// (success)3-2: 飞灰的物质流
function cal_ash_massStream_leavingNode(hourlyExcludeAirVolume, hourlyCoalMillAirVolume, hourlyAQCAirVolume, ashDensity, hourlyClinkerProduction){
    let ashMassStream = (hourlyExcludeAirVolume + hourlyCoalMillAirVolume + hourlyAQCAirVolume) * ashDensity / hourlyClinkerProduction;
    return ashMassStream
}
// (success)3-3: 冷却空气的物质流
function cal_CoalMillAir_massStream_leavingNode(hourlyCoalMillAirVolume, hourlyClinkerProduction){
    let airMassStream = (hourlyCoalMillAirVolume * standardAirDensity) / hourlyClinkerProduction;
    return airMassStream
}
// (success)3-4: 二次空气
function cal_secondAir_massStream_leavingNode(hourlySecondAirVolume, hourlyClinkerProduction, carbonMonoxideDensitySecond, carbonDioxideDensitySecond, oxygenDensitySecond, nitrogenDensitySecond, carbonMonoxideVolumeFractionSecond, carbonDioxideVolumeFractionSecond, oxygenVolumeFractionSecond, nitrogenVolumeFractionSecond, SecondDustContent){
    let secondAirDensity = (
        carbonMonoxideDensitySecond * carbonMonoxideVolumeFractionSecond +
        carbonDioxideDensitySecond * carbonDioxideVolumeFractionSecond+
        oxygenDensitySecond * oxygenVolumeFractionSecond +
        nitrogenDensitySecond * nitrogenVolumeFractionSecond) / 100;

    let secondAirMassStream = (hourlySecondAirVolume * secondAirDensity / hourlyClinkerProduction) + SecondDustContent;
    return secondAirMassStream;
}
// (success)3-5: 三次空气
function cal_thirdAir_massStream_leavingNode(hourlyThirdAirVolume, hourlyClinkerProduction, ThirdDustContent, carbonMonoxideDensityThird, carbonDioxideDensityThird, oxygenDensityThird, nitrogenDensityThird, carbonMonoxideVolumeFractionThird, carbonDioxideVolumeFractionThird, oxygenVolumeFractionThird, nitrogenVolumeFractionThird){
    let thirdAirDensity = (
        carbonMonoxideDensityThird * carbonMonoxideVolumeFractionThird +
        carbonDioxideDensityThird * carbonDioxideVolumeFractionThird+
        oxygenDensityThird * oxygenVolumeFractionThird +
        nitrogenDensityThird * nitrogenVolumeFractionThird) / 100;
	let DustMassStream = hourlyThirdAirVolume * ThirdDustContent / hourlyClinkerProduction
    let thirdAirMassStream = (hourlyThirdAirVolume * thirdAirDensity / hourlyClinkerProduction) + DustMassStream;
    return thirdAirMassStream;
}
// (success)3-6: AQC空气
function cal_AQCAir_massStream_leavingNode(hourlyAQCAirVolume, hourlyClinkerProduction){
    let AQCAirMassStream = hourlyAQCAirVolume * standardAirDensity / hourlyClinkerProduction;
    return AQCAirMassStream;
}
// (success)3-7：冷却水
function cal_coolerWater_massStream_leavingNode(hourlyCoolerWater, hourlyClinkerProduction){
	let coolerWaterMassStream = hourlyCoolerWater / hourlyClinkerProduction;
	return coolerWaterMassStream
}
// (success)3-8: 冷却机排余风
function cal_ExcludeAir_massStream_leavingNode(hourlyExcludeAirVolume, hourlyClinkerProduction){
	let ExcludeAirMassStream = hourlyExcludeAirVolume * standardAirDensity / hourlyClinkerProduction
	return ExcludeAirMassStream;
}
function cal_total_sensible_leavingNode(hourlyExcludeAirVolume, hourlyCoalMillAirVolume, hourlyAQCAirVolume, ashDensity, hourlyClinkerProduction, clinkerSpecificHeat, clinkerTemperature, ashSpecificHeat, ExcludeAirTemperature, CoalMillAirTemperature, AQCAirTemperature, ashContent, hourlySecondAirVolume, secondAirTemperature, carbonMonoxideVolumeFractionSecond, carbonDioxideVolumeFractionSecond, oxygenVolumeFractionSecond, nitrogenVolumeFractionSecond, carbonMonoxideSpecificHeatSecond, carbonDioxideSpecificHeatSecond, oxygenSpecificHeatSecond, nitrogenSpecificHeatSecond, SecondDustContent, hourlyThirdAirVolume, thirdAirTemperature, thirdAirSpecificHeat, hourlySteamedWater, hourlyCoolerWater, coolerWaterOutTemperature, heatOfVaporization, waterSpecificHeat){
    let clinkerSensible = cal_clinker_sensible_leavingNode(hourlyExcludeAirVolume, hourlyCoalMillAirVolume, hourlyAQCAirVolume, ashDensity, hourlyClinkerProduction, clinkerSpecificHeat, clinkerTemperature)
    let ashSensible = cal_ash_sensible_leavingNode(hourlyExcludeAirVolume, hourlyCoalMillAirVolume, hourlyAQCAirVolume, ashSpecificHeat, hourlyClinkerProduction, ExcludeAirTemperature, CoalMillAirTemperature, AQCAirTemperature, ashContent)
    let secondAirSensible = cal_secondAir_sensible_enteringNode(hourlySecondAirVolume, hourlyClinkerProduction, secondAirTemperature, carbonMonoxideVolumeFractionSecond, carbonDioxideVolumeFractionSecond, oxygenVolumeFractionSecond, nitrogenVolumeFractionSecond, carbonMonoxideSpecificHeatSecond, carbonDioxideSpecificHeatSecond, oxygenSpecificHeatSecond, nitrogenSpecificHeatSecond, SecondDustContent, clinkerSpecificHeat)
    let thirdAirSensible = cal_thirdAir_sensible_leavingNode(hourlyThirdAirVolume, hourlyClinkerProduction, thirdAirTemperature, thirdAirSpecificHeat)
    let airSensible = cal_CoalMillAir_sensible_leavingNode(hourlyCoalMillAirVolume, hourlyClinkerProduction, CoalMillAirTemperature)
    let AQCAirSensible = cal_AQCAir_sensible_leavingNode(hourlyAQCAirVolume, hourlyClinkerProduction, AQCAirTemperature)
	let coolerWaterSensible = cal_coolerWater_sensible_leavingNode(hourlySteamedWater, hourlyCoolerWater,  coolerWaterOutTemperature, heatOfVaporization, hourlyClinkerProduction, waterSpecificHeat)
	let ExcludeAirSensible = cal_ExcludeAir_sensible_leavingNode(hourlyExcludeAirVolume, hourlyClinkerProduction, ExcludeAirTemperature)
	
    let totalLeavingNodeSensible = clinkerSensible + ashSensible + secondAirSensible + thirdAirSensible + airSensible + AQCAirSensible + coolerWaterSensible + ExcludeAirSensible
    return totalLeavingNodeSensible
}
// (success)4-1: 低温水泥显热
function cal_clinker_sensible_leavingNode(hourlyExcludeAirVolume, hourlyCoalMillAirVolume, hourlyAQCAirVolume, ashDensity, hourlyClinkerProduction, clinkerSpecificHeat, clinkerTemperature){
    let ashMassStream = cal_ash_massStream_leavingNode(hourlyExcludeAirVolume, hourlyCoalMillAirVolume, hourlyAQCAirVolume, ashDensity, hourlyClinkerProduction)
	let clinkerSensible = (1 - ashMassStream) * clinkerSpecificHeat * clinkerTemperature
    return clinkerSensible
}
// (success)4-2: 飞灰显热
function cal_ash_sensible_leavingNode(hourlyExcludeAirVolume, hourlyCoalMillAirVolume, hourlyAQCAirVolume, ashSpecificHeat, hourlyClinkerProduction, ExcludeAirTemperature, CoalMillAirTemperature, AQCAirTemperature, ashContent){
	let ashSensible = (hourlyExcludeAirVolume * ashContent * ashSpecificHeat * ExcludeAirTemperature / hourlyClinkerProduction) + (hourlyCoalMillAirVolume * ashContent * ashSpecificHeat * CoalMillAirTemperature / hourlyClinkerProduction) + (hourlyAQCAirVolume * ashContent * ashSpecificHeat * AQCAirTemperature / hourlyClinkerProduction)
    return ashSensible;
}
// (success)4-3: 二次空气显热
function cal_secondAir_sensible_enteringNode(hourlySecondAirVolume, hourlyClinkerProduction, secondAirTemperature, carbonMonoxideVolumeFractionSecond, carbonDioxideVolumeFractionSecond, oxygenVolumeFractionSecond, nitrogenVolumeFractionSecond, carbonMonoxideSpecificHeatSecond, carbonDioxideSpecificHeatSecond, oxygenSpecificHeatSecond, nitrogenSpecificHeatSecond, SecondDustContent, clinkerSpecificHeat){
    let secondAirSpecificHeat = (
        (carbonMonoxideVolumeFractionSecond * carbonMonoxideSpecificHeatSecond) +
        (carbonDioxideVolumeFractionSecond * carbonDioxideSpecificHeatSecond) +
        (oxygenVolumeFractionSecond * oxygenSpecificHeatSecond) +
        (nitrogenVolumeFractionSecond * nitrogenSpecificHeatSecond)) / 100;

    let secondAirSensible = (hourlySecondAirVolume * secondAirSpecificHeat * secondAirTemperature / hourlyClinkerProduction) + (SecondDustContent * clinkerSpecificHeat * secondAirTemperature);
    return secondAirSensible;
}
// (warning)4-4: 三次空气显热
function cal_thirdAir_sensible_leavingNode(hourlyThirdAirVolume, hourlyClinkerProduction, thirdAirTemperature, thirdAirSpecificHeat){
    let thirdAirSensible = hourlyThirdAirVolume * thirdAirSpecificHeat * thirdAirTemperature / hourlyClinkerProduction;
    return thirdAirSensible;
}
// (success)4-5: 冷却机空气显热
function cal_CoalMillAir_sensible_leavingNode(hourlyCoalMillAirVolume, hourlyClinkerProduction, CoalMillAirTemperature){
    let airSensible = hourlyCoalMillAirVolume * standardAirSpecificHeat * CoalMillAirTemperature / hourlyClinkerProduction;
    return airSensible;
}
// (success)4-6: AQC空气显热
function cal_AQCAir_sensible_leavingNode(hourlyAQCAirVolume, hourlyClinkerProduction, AQCAirTemperature){
    let AQCAirSensible = hourlyAQCAirVolume * standardAirSpecificHeat * AQCAirTemperature / hourlyClinkerProduction
    return AQCAirSensible
}
// (success)4-7:冷却水
function cal_coolerWater_sensible_leavingNode(hourlySteamedWater, hourlyCoolerWater,  coolerWaterOutTemperature, heatOfVaporization, hourlyClinkerProduction, waterSpecificHeat){
	let coolerWaterSensible = (hourlySteamedWater * coolerWaterOutTemperature * waterSpecificHeat + hourlyCoolerWater * heatOfVaporization) / hourlyClinkerProduction
	return coolerWaterSensible
}
// (success)4-8: 冷却机排余风
function cal_ExcludeAir_sensible_leavingNode(hourlyExcludeAirVolume, hourlyClinkerProduction, ExcludeAirTemperature){
	let ExcludeAirSensible = hourlyExcludeAirVolume * standardAirSpecificHeat * ExcludeAirTemperature / hourlyClinkerProduction
	return ExcludeAirSensible
}