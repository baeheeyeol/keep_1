package com.keep.member.service;

import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Service;

import com.keep.member.dto.MemberDTO;
import com.keep.member.entity.MemberEntity;
import com.keep.member.repository.MemberRepository;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class MemberService {
	private final MemberRepository memberRepository;

	@Transactional
	public boolean save(MemberDTO memberDTO) {
		// 1. DTO → Entity 변환
		MemberEntity entity = MemberEntity.toMemberEntity(memberDTO);
	
		// 2. 저장 + 즉시 flush (DB 반영)
		MemberEntity saved = memberRepository.saveAndFlush(entity);

		// 3. DB에 존재 여부 확인
		boolean exists = memberRepository.existsById(saved.getId());
		return exists;
	}

	public long countByEmail(@Param("email") String email) {
		return memberRepository.countByEmail(email);
	};

	public long countByEmailAndPassword(@Param("email") String email, @Param("password") String password) {
		return memberRepository.countByEmailAndPassword(email, password);
	};
}
