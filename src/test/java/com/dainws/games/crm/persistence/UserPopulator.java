package com.dainws.games.crm.persistence;

import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.TestComponent;

import com.dainws.games.crm.domain.User;
import com.dainws.games.crm.domain.UserPlatform;
import com.dainws.games.crm.domain.repositories.UserRepository;

@TestComponent
public class UserPopulator {

	@Autowired
	private UserRepository userRepository;
	
	public User populate() {
		User user = this.createBasic();
		return this.populate(user);
	}
	
	public User populate(User user) {
		this.userRepository.save(user);
		return user;
	}
	
	private User createBasic() {
		String code = UUID.randomUUID().toString();
		String name = "RamdomUser-"+code;
		return new User(code, name, UserPlatform.WEB);
	}
}
