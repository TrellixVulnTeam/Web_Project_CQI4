﻿using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Text.Json;

using ParentDal;

using System.Net.Http;
using System.Web.Http;
using System.Text;
using System.IO;
using Newtonsoft.Json;
using System.Data;
using WMS.Models.VM;
using ParentsApi.HelperClasses;

//	--- To remove ---
using Microsoft.AspNetCore.Cors;
using System.Security.Claims;
//using Microsoft.AspNet.WebApi.Core;

namespace ParentsApi.Controllers
{
	[ApiController]
	[Microsoft.AspNetCore.Mvc.Route("api/[controller]/[action]")]

	public class ParentController : Controller
	{
		private JwtManager jwtManager;

		public ParentController(JwtManager jwtManager)
		{
			this.jwtManager = jwtManager;
		}


		#region -------------  HTTP functions  -------------

		// Puts a new user into the database
		// Returns is the register was successful or failed, returns if the user alreadt exists in the database
		[Microsoft.AspNetCore.Mvc.HttpPost]
		[Microsoft.AspNetCore.Mvc.ActionName("ParentRegister")]
		public ContentResult ParentRegister()
		{
			string result = ParentHelperFunctions.ParentRegister(Request.Headers["username"].ToString() ,Request.Headers["email"].ToString(), Request.Headers["password"].ToString());
			return base.Content(result);
		}



		//	Checks if the user exists in the database
		//	Returns information about the user
		[Microsoft.AspNetCore.Mvc.HttpPost]
		[Microsoft.AspNetCore.Mvc.ActionName("ParentLogin")]
		public ContentResult ParentLogin()
		{
			//string result = ;
			return base.Content(JsonConvert.SerializeObject(new
			{
				FromParent = ParentHelperFunctions.ParentLogin(Request.Headers["email"].ToString(), Request.Headers["password"].ToString()),
				token = jwtManager.GenerateToken(Request.Headers["email"].ToString()),
			}));
		}

		[Microsoft.AspNetCore.Mvc.HttpPost]
		[Microsoft.AspNetCore.Mvc.ActionName("ParentDisconnect")]
		public void ParentDisconnect()
		{
			jwtManager.DisconnectActiveUser(Request.Headers["email"].ToString());
		}



		//	Adds a new child to the database
		//	Returns if the child was added, and information about the child
		[Microsoft.AspNetCore.Mvc.HttpPost]
		[Microsoft.AspNetCore.Mvc.ActionName("AddChild")]
		public ContentResult AddChild()
		{

			Child child = new Child(Request.Headers["childName"].ToString(), int.Parse(Request.Headers["childAge"].ToString()));

			return base.Content(ParentHelperFunctions.AddChild(int.Parse(Request.Headers["parentId"].ToString()), child));
		}



		[Microsoft.AspNetCore.Mvc.HttpPost]
		[Microsoft.AspNetCore.Mvc.ActionName("DeleteChild")]
		public ContentResult DeleteChild()
		{
			return base.Content(ParentHelperFunctions.DeleteChild
				(
					int.Parse(Request.Headers["childId"].ToString()), 
					int.Parse(Request.Headers["parentId"].ToString()))
				);
		}



		[Microsoft.AspNetCore.Mvc.HttpPost]
		[Microsoft.AspNetCore.Mvc.ActionName("GetChildren")]
		public ContentResult GetChildren()
		{
			return base.Content(ParentHelperFunctions.GetChildren(int.Parse(Request.Headers["parentId"].ToString())));
		}



		[Microsoft.AspNetCore.Mvc.HttpPost]
		[Microsoft.AspNetCore.Mvc.ActionName("SelectChild")]
		public ContentResult SelectChild()
		{
			int parentId = int.Parse(Request.Headers["parentId"].ToString());
			int childId = int.Parse(Request.Headers["childId"].ToString());

			return base.Content(ParentHelperFunctions.SelectChild(childId, parentId));
		}




		//	---	Evaluations ---

		[Microsoft.AspNetCore.Mvc.HttpPost]
		[Microsoft.AspNetCore.Mvc.ActionName("UpdateEvaluationScore")]
		public ContentResult UpdateEvaluationScore()
		{
			int childId = int.Parse(Request.Headers["childId"].ToString());
			int gameId = int.Parse(Request.Headers["gameId"].ToString());
			int finishedGameScore = int.Parse(Request.Headers["gameScore"].ToString());

			bool hasUpdatedEvaluation = ParentHelperFunctions.UpdateChildEvaluation(childId, gameId, finishedGameScore);

			//	TODO: return confirmed update
			return base.Content(JsonConvert.SerializeObject(new { UpdatedEvaluation = hasUpdatedEvaluation }));
		}

		#endregion
	}
}