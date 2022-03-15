package com.luv2code.ecommerce.service;

import java.util.Set;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.luv2code.ecommerce.dao.CustomerRepo;
import com.luv2code.ecommerce.dto.Purchase;
import com.luv2code.ecommerce.dto.PurchaseResponse;
import com.luv2code.ecommerce.entity.Customer;
import com.luv2code.ecommerce.entity.Order;
import com.luv2code.ecommerce.entity.OrderItems;

@Service

public class CheckOutServiceImpl  implements CheckOutService{

	
	private CustomerRepo repo;
	
	@Autowired
	public CheckOutServiceImpl(CustomerRepo rep) {
		this.repo=rep;
	}
	
	@Override
	@Transactional
	public PurchaseResponse plaseOrder(Purchase purchase) {

      Order order = purchase.getOrder();
      
      String orderTrachingNumber= genrateOrderTrackingNumber();
      
      order.setOrder_tracking_number(orderTrachingNumber);
      
      Set<OrderItems> orderItems= purchase.getOrderItems();
      orderItems.forEach(item -> order.add(item));
		
      
      order.setBilling_address_id(purchase.getBillingAddress());
      order.setShipping_address_id(purchase.getShippingAddress());
      
      Customer customer = purchase.getCustomer();
      customer.add(order);
      repo.save(customer);
		return new PurchaseResponse(orderTrachingNumber);
	}

	private String genrateOrderTrackingNumber() {


		return UUID.randomUUID().toString();
	}

}
