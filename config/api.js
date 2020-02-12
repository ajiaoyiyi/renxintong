
import { request } from '../utils/request.js'
module.exports = {
	/**
	 * 用户注册接口:post
	 * @params {Object} data:用户基本信息（姓名，身份证号等），角色id，企业id，union_id 
	 * @returns {Object} 注册结果（成功，失败，失败原因）
	 */
	UserRegister: (data) => request({
		url: '/virus/user/register',
		method: 'POST',
		data
	}),

	/**
	 * 用户信息查询接口:get
	 * @params {Object} data:union_id 
	 * @returns {Object} 用户信息（角色，名字等），若未注册，返回一个特定的错误码
	 */
	UserInfo: (data) => request({
		url: '/virus/user',
		method: 'GET',
		data
	}),

	/**
	 * 接入码校验接口:post
	 * @params {Object} data:接入码
	 * @returns {Object} 企业名，角色名，角色id，企业id，若输入错误，返回一个特定的错误码
	 */
	AccessCode: (data) => request({
		url: '/virus/accessCode',
		method: 'POST',
		data
	}),

	/**
	 * 身份证校验接口:post
	 * @params {Object} data:姓名，身份证号
	 * @returns {Object} 姓名，身份证号，出生日期，籍贯，年龄，性别
	 */
	CheckIdCard: (data) => request({
		url: '/virus/user/idCard',
		method: 'POST',
		data
	}),

	/**
	 * 通行证电子二维码获取接口:post
	 * @params {Object} data:union_id
	 * @returns {Object} 通行证二维码
	 */
	PermitQRCode: (data) => request({
		url: '/virus/permit',
		method: 'POST',
		data
	}),

	/**
	 * 通行证电子二维码扫描接口:get
	 * @params {Object} data:被扫描的通行证二维码
	 * @returns {Object} 通行证信息及用户信息
	 */
	ScanQRCode: (data) => request({
		url: '/virus/permit',
		method: 'GET',
		data
	}),

	/**
	 * 通行证信息上报接口（进门）:post
	 * @params {Object} data:扫描人union_id，通行证id，被扫描人的信息（体温等）
	 * @returns {Object} 上报结果（成功，失败，失败原因）
	 */
	PermitIn: (data) => request({
		url: '/virus/permit/in',
		method: 'POST',
		data
	}),

	/**
	 * 通行证信息上报接口（出门）:post
	 * @params {Object} data:扫描人union_id，通行证id，被扫描人的信息（体温等）
	 * @returns {Object} 上报结果（成功，失败，失败原因）
	 */
	PermitOut: (data) => request({
		url: '/virus/permit/out',
		method: 'POST',
		data
	}),

	/**
	 * 通行证扫描记录查询接口:get
	 * @params {Object} data:用户union_id
	 * @returns {Object} 通行证记录信息
	 */
	PermitList: (data) => request({
		url: '/virus/permit/history',
		method: 'GET',
		data
	}),

	/**
	 * 手机验证码发送接口:get
	 * @params {Object} data:用户手机号
	 * @returns {Object} 发送结果（成功，失败）
	 */
	SendTelVerify: (data) => request({
		url: '/virus/verify',
		method: 'GET',
		data
	}),

	/**
	 * 手机验证码校验接口:post
	 * @params {Object} data:手机号，验证码
	 * @returns {Object} 发送结果（成功，失败）
	 */
	CheckTelVerify: (data) => request({
		url: '/virus/user/verifyCode',
		method: 'POST',
		data
	})
}