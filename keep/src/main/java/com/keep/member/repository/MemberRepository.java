package com.keep.member.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.keep.member.entity.MemberEntity;

public interface MemberRepository extends JpaRepository<MemberEntity, Long> {
	//이메일 중복화인
	long countByEmail(String email);
	//로그인 id,password 확인
	long countByEmailAndPassword(String email,String password);
}