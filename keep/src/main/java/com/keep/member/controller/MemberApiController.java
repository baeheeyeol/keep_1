package com.keep.member.controller;

import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.keep.member.dto.MemberDTO;
import com.keep.member.service.MemberService;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping(value = "/api/member")
public class MemberApiController {
	private final MemberService memberService;
	
	@PostMapping("/checkEmail")
	public long countByEmail(@RequestBody MemberDTO memberDTO) {
		return memberService.countByEmail(memberDTO.getEmail());
	}
	
	@PostMapping("/login")
	public long countByIdAndPassword(@RequestBody MemberDTO memberDTO) {
		return memberService.countByEmailAndPassword(memberDTO.getEmail(),memberDTO.getPassword());
	}
	
	@PostMapping("/save")
	public boolean save(@RequestBody MemberDTO memberDTO) {
		return memberService.save(memberDTO);
	}
}
