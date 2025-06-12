'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { performHealthCheck, testApiConfiguration, logApiInfo, type HealthCheckResult } from '@/lib/health-check';
import { RefreshCw, Server, CheckCircle, XCircle, AlertCircle } from 'lucide-react';

export function BackendStatus() {
    const [healthStatus, setHealthStatus] = useState<HealthCheckResult | null>(null);
    const [loading, setLoading] = useState(false);
    const [apiConfig, setApiConfig] = useState<{
        apiUrl: string;
        isConfigured: boolean;
    } | null>(null);

    const checkBackendStatus = async () => {
        setLoading(true);
        try {
            const config = await testApiConfiguration();
            setApiConfig({
                apiUrl: config.apiUrl,
                isConfigured: config.isConfigured
            });
            setHealthStatus(config.healthCheck);

            // Log API info to console
            logApiInfo();
        } catch (error) {
            setHealthStatus({
                status: 'unknown',
                message: 'Failed to check backend status',
                timestamp: new Date().toISOString()
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        checkBackendStatus();
    }, []);

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'healthy':
                return <CheckCircle className="h-4 w-4 text-green-500" />;
            case 'unhealthy':
                return <XCircle className="h-4 w-4 text-red-500" />;
            default:
                return <AlertCircle className="h-4 w-4 text-yellow-500" />;
        }
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'healthy':
                return <Badge variant="default" className="bg-green-500">Conectado</Badge>;
            case 'unhealthy':
                return <Badge variant="destructive">Desconectado</Badge>;
            default:
                return <Badge variant="secondary">Desconhecido</Badge>;
        }
    };

    return (
        <Card>
            <CardHeader>
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Server className="h-5 w-5" />
                        <CardTitle>Status do Backend</CardTitle>
                    </div>
                    <Button
                        onClick={checkBackendStatus}
                        disabled={loading}
                        size="sm"
                        variant="outline"
                    >
                        <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                        Atualizar
                    </Button>
                </div>
                <CardDescription>
                    Monitoramento da conexão com a API backend
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                {/* API Configuration */}
                <div>
                    <h4 className="text-sm font-medium mb-2">Configuração da API</h4>
                    <div className="flex items-center gap-2 text-sm">
                        <span className="text-muted-foreground">URL:</span>
                        <code className="bg-muted px-2 py-1 rounded text-xs">
                            {apiConfig?.apiUrl || 'Carregando...'}
                        </code>
                    </div>
                    <div className="flex items-center gap-2 text-sm mt-1">
                        <span className="text-muted-foreground">Status:</span>
                        {apiConfig?.isConfigured ? (
                            <Badge variant="default" className="bg-blue-500">Configurado</Badge>
                        ) : (
                            <Badge variant="secondary">Usando padrão local</Badge>
                        )}
                    </div>
                </div>

                <Separator />

                {/* Health Status */}
                <div>
                    <h4 className="text-sm font-medium mb-2">Status da Conexão</h4>
                    {healthStatus ? (
                        <div className="space-y-2">
                            <div className="flex items-center gap-2">
                                {getStatusIcon(healthStatus.status)}
                                {getStatusBadge(healthStatus.status)}
                                {healthStatus.responseTime && (
                                    <span className="text-xs text-muted-foreground">
                                        {healthStatus.responseTime}ms
                                    </span>
                                )}
                            </div>
                            <p className="text-sm text-muted-foreground">
                                {healthStatus.message}
                            </p>
                            <p className="text-xs text-muted-foreground">
                                Última verificação: {new Date(healthStatus.timestamp).toLocaleString('pt-BR')}
                            </p>
                        </div>
                    ) : (
                        <div className="flex items-center gap-2">
                            <div className="h-4 w-4 bg-muted animate-pulse rounded" />
                            <span className="text-sm text-muted-foreground">Verificando...</span>
                        </div>
                    )}
                </div>

                {/* Instructions */}
                {apiConfig && !apiConfig.isConfigured && (
                    <>
                        <Separator />
                        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                            <h5 className="text-sm font-medium text-yellow-800 mb-1">
                                ⚠️ Configuração Necessária
                            </h5>
                            <p className="text-xs text-yellow-700 mb-2">
                                Para conectar ao seu backend no Coolify, configure a variável de ambiente:
                            </p>
                            <code className="block bg-yellow-100 px-2 py-1 rounded text-xs text-yellow-800">
                                NEXT_PUBLIC_API_URL=https://your-backend-domain.coolify.app
                            </code>
                        </div>
                    </>
                )}
            </CardContent>
        </Card>
    );
}
