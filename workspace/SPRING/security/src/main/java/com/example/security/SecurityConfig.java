package com.example.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.provisioning.InMemoryUserDetailsManager;
import org.springframework.security.web.SecurityFilterChain;

@EnableWebSecurity
@Configuration
public class SecurityConfig {


    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        // authorizeHttpRequests() : http 통신에 대한 인가정책을 설정
        http.authorizeHttpRequests(auth -> auth.anyRequest().authenticated())
                .formLogin(form -> form
//                        .loginPage("/loginPage")  // 사용자 정의 로그인 페이지로 전환, 기본 로그인페이지 무시
//                        .loginProcessingUrl("loginProc") // 사용자 이름과 비밀번호를 검증할 URL지정 (Form action)
                        .defaultSuccessUrl("/", true) // 로그인 성공 이후 이동 페이지, alwausUse가 true면 무조건 지정 위치로 이동 (기본은 flase)
                                                                            // 인증 전에 보안이 필요한 페이지를 방문하다가 인증에 성공한 경우 이전 위치로 리다이렉트 됨
                        .failureUrl("/failed") // 인증 실패 시, 사용자에게 보내질 URL 지정, 기본값은 "/login?error"
                        .usernameParameter("userId") // 인증을 수행할 때 사용자 이름(아이디)을 찾기 위해 확인하는 http 매개변수 설정, 기본값은 username
                        .passwordParameter("password") // 인증을 수행할 때 비밀번호를 찾기 위해 확인하는 HTTP 매개변수 설정, 기본값은 password
                        // 인증 성공 시 사용할 AuthenticationSuccessHandler 지정. 기본값은 SacedRequestAwareAuthenticationSuccessHandler
                        .successHandler((request, response, authentication) -> {
                                System.out.println("authentication : " + authentication);  // 인증에 성공했던 객체 정보
                                response.sendRedirect("/home");  // defaultSuccessUrl 보다 우선시 됨. defaultSuccessUrl 는 내부적으로 successHandler이 작동하기 때문
                        })
                        // 인증 실패 시 사용ㅎㄹ AuthenticationFailureHandler 지정. 기본값은 SimpleUrlAuthenticationFailureHandler
                        .failureHandler((request, response, exception) -> {
                            System.out.println("exception : " + exception.getMessage());
                            response.sendRedirect("/login");
                        })
                        .permitAll()  // failureUrl(), loginPage(), loginProcessingUrl()에 대한 URL에 모든 사용자의 접근을 허용 함
                );

        return http.build();
    }

    // 자바 설정 클래스에서 직접 유저 정보를 관리하는 클래스
    // User는 UserDetails클래스 타입으로 자바에서 제공함.
    // application.propertues와 설정이 중복될 경우, 이게 더 우선시 됨
    @Bean
    public UserDetailsService userDetailsService() {

        UserDetails user = User.withUsername("user")
                .password("{noop}1111")  // 평문으로 패스워드 사용
                .roles("USER")
                .build();

        return new InMemoryUserDetailsManager(user);
    }
}
