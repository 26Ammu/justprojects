/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

import java.io.IOException;
import java.io.PrintWriter;
import java.math.BigDecimal;
import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.Statement;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.TimeZone;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import pack7.subpack7;

/**
 *
 * @author amrut
 */
@WebServlet(urlPatterns = {"/account_db"})
public class account_db extends HttpServlet {

    /**
     * Processes requests for both HTTP <code>GET</code> and <code>POST</code>
     * methods.
     *
     * @param request servlet request
     * @param response servlet response
     * @throws ServletException if a servlet-specific error occurs
     * @throws IOException if an I/O error occurs
     */
    protected void processRequest(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        response.setContentType("text/html;charset=UTF-8");
        PrintWriter out = response.getWriter();
        String submit = request.getParameter("submit");

       if (submit != null) {
    SimpleDateFormat sdf = new SimpleDateFormat("dd-MM-yyyy HH:mm:ss");
    sdf.setTimeZone(TimeZone.getTimeZone("Asia/Kolkata"));
    String localDateTime = sdf.format(new Date());

    
    String customerIdStr = request.getParameter("customer_id");
int customer_id = Integer.parseInt(customerIdStr); 


  
    String account_type = request.getParameter("account_type");
    String initial_deposit_str = request.getParameter("initial_deposit");
    String operation_mode = request.getParameter("operation_mode");
    
    String bank_name = request.getParameter("bank_name");
     String status = request.getParameter("status");

    try {
        BigDecimal initial_deposit = new BigDecimal(initial_deposit_str);
        BigDecimal balance = initial_deposit;

        Class.forName("com.mysql.jdbc.Driver");
        Connection con = new subpack7().getConnection();
        Statement stat = con.createStatement();

       
       

        // Insert account directly using customer_id
        String query = "INSERT INTO account(customer_id, account_type, bank_name, initial_deposit, operation_mode, balance, date, status) "
                     + "VALUES ('" + customer_id + "','" + account_type + "','"+bank_name+"','" + initial_deposit + "','" + operation_mode + "','" + balance + "','" + localDateTime + "','pending')";

        stat.executeUpdate(query);

        out.println("<script>alert(\"Account created successfully\")</script>");
        out.println("<meta http-equiv = \"refresh\" content = \"0;view_account.jsp?customer_id=" + customer_id + "\" />");

        con.close();

    } catch (Exception e) {
        out.println("Error: " + e.getMessage());
    }
} else {
    out.println("<script>alert(\"Account not created\")</script>");
    out.println("<meta http-equiv = \"refresh\" content = \"0;open_account.jsp\" />");
}
    }


    // <editor-fold defaultstate="collapsed" desc="HttpServlet methods. Click on the + sign on the left to edit the code.">
    /**
     * Handles the HTTP <code>GET</code> method.
     *
     * @param request servlet request
     * @param response servlet response
     * @throws ServletException if a servlet-specific error occurs
     * @throws IOException if an I/O error occurs
     */
    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        processRequest(request, response);
    }

    /**
     * Handles the HTTP <code>POST</code> method.
     *
     * @param request servlet request
     * @param response servlet response
     * @throws ServletException if a servlet-specific error occurs
     * @throws IOException if an I/O error occurs
     */
    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        processRequest(request, response);
    }

    /**
     * Returns a short description of the servlet.
     *
     * @return a String containing servlet description
     */
    @Override
    public String getServletInfo() {
        return "Short description";
    }// </editor-fold>

}
