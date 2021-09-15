package com.cgi.library.repository;

import com.cgi.library.entity.Book;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface BookRepository extends JpaRepository<Book, UUID> {

    // References:
    // - http://www.h2database.com/html/functions.html#concat_ws
    // - https://www.baeldung.com/spring-jpa-like-queries
    // - https://www.baeldung.com/spring-data-jpa-query
    @Query("SELECT b from Book b where CONCAT_WS(' ', b.id, b.title, b.author, b.genre, b.year, b.added, b.checkOutCount, b.status, b.dueDate, b.comment) like %:searchTerm%")
    Page<Book> searchFreeText(@Param("searchTerm") String searchTerm, Pageable pageable);
}
