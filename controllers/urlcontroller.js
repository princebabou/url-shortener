const express = require('express');
const Joi = require('joi');
const mysql = require('mysql');
const connection = require('../models/database')

const port = 3000;
const app = express();

app.use(express.json());

const longUrlSchema = Joi.string().uri({ scheme: ['http', 'https'] }).required().messages({
  'string.url': 'Invalid URL format. Must start with http:// or https://',
  'any.required': 'Long URL is required'
});


const ShortenUrl = ((req, res) => {
    const { error } = longUrlSchema.validate(req.body.longUrl);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }
  
    const { longUrl } = req.body;
  
    const shortCode = Math.random().toString(36).substring(7);
  
    const sql = 'INSERT INTO urls (long_url, short_code) VALUES (?, ?)';
    connection.query(sql, [longUrl, shortCode], (err, result) => {
      if (err) {
        console.error('Error inserting URL into database: ', err);
        res.status(500).json({ error: 'Internal server error' });
        return;
      }
      console.log('URL shortened successfully');
      res.json({ shortUrl: `http://localhost:${port}/${shortCode}` });
    });
  });
  
  const getShortCode = ((req, res) => {
    const { shortCode } = req.params;
  
    const sql = 'SELECT long_url FROM urls WHERE short_code = ?';
    connection.query(sql, [shortCode], (err, result) => {
      if (err) {
        console.error('Error retrieving URL from database: ', err);
        res.status(500).json({ error: 'Internal server error' });
        return;
      }
      if (result.length === 0) {
        res.status(404).json({ error: 'URL not found' });
        return;
      }
      console.log('URL found, redirecting');
      res.redirect(result[0].long_url);
    });
  });
  
  const getHistoryById = ((req, res) => {
    const { id } = req.params;
  
    const sql = 'SELECT * FROM urls WHERE id = ?';
    connection.query(sql, [id], (err, results) => {
      if (err) {
        console.error('Error retrieving URLs from database: ', err);
        res.status(500).json({ error: 'Internal server error' });
        return;
      }
      
      if (results.length === 0) {
        res.status(404).json({ error: 'No URLs found for the user' });
        return;
      }
  
      res.json({ urls: results });
    });
  });

  module.exports = {ShortenUrl, getShortCode, getHistoryById};
  