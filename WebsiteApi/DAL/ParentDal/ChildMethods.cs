﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

using System.Data;
using System.Data.Odbc;
using DAL;

namespace ParentDal
{
    public class ChildMethods
    {
        //Add
        //Delete


        /// <summary>
        /// Returns all children's names and ages for teh matching parent id as a DataTable object
        /// </summary>
        /// <param name="parentId"></param>
        /// <returns></returns>
        public static DataTable GetChildrenForParent(int parentId)
        {
            string com = "SELECT child_age, child_name FROM child WHERE parent_id=?";

            OdbcParameter[] queryParameters = {
                new OdbcParameter("@parent_id", parentId)
            };

            return OdbcHelper.GetTable(com, queryParameters);
        }

        public static int AddChild(int parentId, int childAge, string childName)
        {
            string com = "INSERT INTO child (parent_id, child_age, child_name) VALUES (?, ?, ?)";

            OdbcParameter[] queryParameters = {
                new OdbcParameter("@parent_id", parentId),
                new OdbcParameter("@child_age", childAge),
                new OdbcParameter("@child_name", childName),
            };

            return OdbcHelper.Execute(com, queryParameters);
        }

        public static int DeleteChild(int childId)
        {
            string com = "DELETE FROM child WHERE child_id=?";

            OdbcParameter[] queryParameters = {
                new OdbcParameter("@parent_id", childId),
            };

            return OdbcHelper.Execute(com, queryParameters);
        }
    }
}
